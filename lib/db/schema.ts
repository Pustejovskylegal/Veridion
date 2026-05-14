import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  bigint,
  jsonb,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/* -----------------------------------------------------------
 * Enums
 * --------------------------------------------------------- */

export const sourceKindEnum = pgEnum("source_kind", [
  "nen",
  "vestnik",
  "ted",
  "profile",
  "other",
]);

export const tenderStatusEnum = pgEnum("tender_status", [
  "open", // soutěž běží, lze podat nabídku
  "awarded", // vybrán dodavatel
  "cancelled", // zrušeno
  "closed", // uzavřeno (nelze rozeznat výsledek)
  "unknown",
]);

export const runStatusEnum = pgEnum("run_status", [
  "running",
  "succeeded",
  "failed",
  "partial",
]);

export const changeSignificanceEnum = pgEnum("change_significance", [
  "critical", // deadline moved, status changed
  "important", // value appeared/changed, type changed
  "minor", // title text, description text, cpv extensions
]);

/* -----------------------------------------------------------
 * Multi-tenancy: organizations + memberships
 * Users are managed by Clerk; we mirror the IDs here.
 * --------------------------------------------------------- */

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrgId: text("clerk_org_id").unique(), // null pokud personal workspace
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"), // owner | admin | member | viewer
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqOrgUser: uniqueIndex("memberships_org_user_uidx").on(t.orgId, t.userId),
  })
);

/* -----------------------------------------------------------
 * Sources of tenders (NEN, Věstník, TED, profiles, ...)
 * --------------------------------------------------------- */

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: sourceKindEnum("kind").notNull(),
  code: text("code").notNull().unique(), // e.g. "nen", "ted-eu", "vestnik"
  name: text("name").notNull(), // human-readable
  baseUrl: text("base_url").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  config: jsonb("config").$type<Record<string, unknown>>(), // adapter-specific
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -----------------------------------------------------------
 * Tenders — central canonical record. Per-source de-duplicated
 * on (source_id, external_id).
 * Workspace lists are filtered by org via org-scoped lists or
 * via subscriptions, but the tender table itself is global
 * (data is public). orgs subscribe / save / annotate.
 * --------------------------------------------------------- */

export const tenders = pgTable(
  "tenders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),

    externalId: text("external_id").notNull(), // ID v původním systému (NEN VZ ID, TED notice ID…)
    sourceUrl: text("source_url").notNull(),

    title: text("title").notNull(),
    description: text("description"),
    contractingAuthority: text("contracting_authority"), // zadavatel
    contractingAuthorityIco: text("contracting_authority_ico"), // IČO

    cpvCodes: text("cpv_codes").array(), // klasifikace zboží/služeb (EU CPV)
    nuts: text("nuts"), // NUTS code (region)
    procurementType: text("procurement_type"), // supplies / services / works
    procedureType: text("procedure_type"), // open / restricted / negotiated / ...

    estimatedValue: bigint("estimated_value", { mode: "number" }), // v haléřích (Kč * 100)
    currency: text("currency").default("CZK"),

    status: tenderStatusEnum("status").notNull().default("open"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),

    raw: jsonb("raw").$type<Record<string, unknown>>(), // celý původní záznam pro audit

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqSourceExternal: uniqueIndex("tenders_source_external_uidx").on(
      t.sourceId,
      t.externalId
    ),
    deadlineIdx: index("tenders_deadline_idx").on(t.deadlineAt),
    publishedIdx: index("tenders_published_idx").on(t.publishedAt),
    statusIdx: index("tenders_status_idx").on(t.status),
  })
);

/* -----------------------------------------------------------
 * Ingestion run audit — for debugging cron + observability
 * --------------------------------------------------------- */

export const tenderChanges = pgTable(
  "tender_changes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenderId: uuid("tender_id")
      .notNull()
      .references(() => tenders.id, { onDelete: "cascade" }),
    runId: uuid("run_id").references(() => tenderRuns.id, {
      onDelete: "set null",
    }),
    field: text("field").notNull(), // např. "deadlineAt", "estimatedValue"
    oldValue: jsonb("old_value"),
    newValue: jsonb("new_value"),
    significance: changeSignificanceEnum("significance").notNull().default("minor"),
    detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    tenderIdx: index("tender_changes_tender_idx").on(t.tenderId, t.detectedAt),
    detectedIdx: index("tender_changes_detected_idx").on(t.detectedAt),
  })
);

export const tenderRuns = pgTable("tender_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  status: runStatusEnum("status").notNull(),
  itemsFetched: integer("items_fetched").default(0),
  itemsCreated: integer("items_created").default(0),
  itemsUpdated: integer("items_updated").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

/* -----------------------------------------------------------
 * Workspace-level: subscriptions, notes, status (per org+tender)
 * --------------------------------------------------------- */

export const tenderSubscriptions = pgTable(
  "tender_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    tenderId: uuid("tender_id")
      .notNull()
      .references(() => tenders.id, { onDelete: "cascade" }),
    state: text("state").notNull().default("watching"), // watching | shortlisted | bidding | dropped | won | lost
    relevanceScore: integer("relevance_score"), // 0-100, vyplní AI vrstva ve fázi 2
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqOrgTender: uniqueIndex("subscriptions_org_tender_uidx").on(t.orgId, t.tenderId),
    orgIdx: index("subscriptions_org_idx").on(t.orgId),
  })
);

/* -----------------------------------------------------------
 * Audit log — every meaningful action (user or system/AI)
 * --------------------------------------------------------- */

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  actor: text("actor").notNull(), // "user" | "system" | "ai"
  action: text("action").notNull(),
  targetTable: text("target_table"),
  targetId: text("target_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -----------------------------------------------------------
 * Relations
 * --------------------------------------------------------- */

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
  subscriptions: many(tenderSubscriptions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  organization: one(organizations, {
    fields: [memberships.orgId],
    references: [organizations.id],
  }),
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  tenders: many(tenders),
  runs: many(tenderRuns),
}));

export const tendersRelations = relations(tenders, ({ one, many }) => ({
  source: one(sources, { fields: [tenders.sourceId], references: [sources.id] }),
  subscriptions: many(tenderSubscriptions),
  changes: many(tenderChanges),
}));

export const tenderChangesRelations = relations(tenderChanges, ({ one }) => ({
  tender: one(tenders, { fields: [tenderChanges.tenderId], references: [tenders.id] }),
  run: one(tenderRuns, { fields: [tenderChanges.runId], references: [tenderRuns.id] }),
}));

export const tenderSubscriptionsRelations = relations(
  tenderSubscriptions,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [tenderSubscriptions.orgId],
      references: [organizations.id],
    }),
    tender: one(tenders, {
      fields: [tenderSubscriptions.tenderId],
      references: [tenders.id],
    }),
    creator: one(users, {
      fields: [tenderSubscriptions.createdBy],
      references: [users.id],
    }),
  })
);
