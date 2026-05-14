# Veridion — Deployment

Postup nasazení landing page na produkci přes GitHub → Vercel → Active 24 doména.

---

## 1. GitHub: vytvořit repo a pushnout kód

### 1.1 Vytvoř prázdný repository
1. Otevři https://github.com/new
2. **Repository name:** `veridion` (nebo `veridion-landing`)
3. **Visibility:** Private (doporučeno před launchem) nebo Public
4. **Nezaškrtávej** „Add a README", „Add .gitignore", „Choose a license" — máme vlastní
5. Klikni **Create repository**

### 1.2 Pushni lokální commit
GitHub ti po vytvoření zobrazí URL repa. V terminálu v rootu projektu spusť:

```bash
git remote add origin https://github.com/<tvuj-username>/veridion.git
git push -u origin main
```

Po prvním pushi GitHub ověří přístup — buď přes prohlížeč (GitHub CLI / Personal Access Token), nebo přes SSH klíč pokud máš nastavený.

---

## 2. Vercel: napojit repo a deploynout

### 2.1 Import projektu
1. Otevři https://vercel.com/new
2. V sekci **Import Git Repository** najdi `veridion` (pokud Vercel ještě nevidí tvůj GitHub, klikni *Add GitHub Account* a povol přístup)
3. Klikni **Import**

### 2.2 Konfigurace (vše už je správně nastavené)
- **Framework Preset:** Next.js (auto-detekce)
- **Root Directory:** `./`
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)
- **Environment Variables:** žádné nepotřeba (landing page je statická)

Klikni **Deploy**. Build trvá ~60 s. Po dokončení dostaneš URL typu `veridion-abc123.vercel.app`.

### 2.3 Otevři produkční URL
Pokud vše vypadá v pořádku, pokračuj k doméně. Každý push do `main` od teď automaticky deploynuje novou verzi.

---

## 3. Doména: propojení s Active 24

### 3.1 Přidej doménu ve Vercelu
1. V Vercel dashboardu otevři projekt `veridion`
2. **Settings → Domains**
3. Do pole napiš svou doménu (např. `veridion.cz`) a klikni **Add**
4. Vercel ti zobrazí dva pokyny:
   - **A record** pro apex (`veridion.cz`) → IP `76.76.21.21`
   - **CNAME record** pro `www.veridion.cz` → `cname.vercel-dns.com`

Nech tuto stránku otevřenou — budeš se k ní vracet.

### 3.2 Nastav DNS v Active 24
Active 24 má vlastní DNS panel. Postup:

1. Přihlas se na https://customer.active24.com/
2. **Domény → vyber svou doménu**
3. Pokud doména **nepoužívá DNS servery Active 24**, nejdřív je aktivuj:
   - V detailu domény klikni *Změnit DNS servery* a zvol *DNS Active 24* (`ns.active24.cz`, `ns.active24.sk`)
   - Pak chvíli (až 24 h) počkej, než se DNS změna propaguje. *Většinou stačí pár minut.*
4. V nabídce vyber **DNS záznamy / Editor DNS**
5. Smaž případné existující A / AAAA / CNAME záznamy pro `@` a `www`, které ukazují jinam
6. Přidej **dva nové záznamy**:

| Typ   | Název | Hodnota                | TTL  |
|-------|-------|------------------------|------|
| A     | `@`   | `76.76.21.21`          | 1800 |
| CNAME | `www` | `cname.vercel-dns.com.` | 1800 |

*Active 24 si u CNAME většinou doplní tečku za hodnotou sama — ale ověř.*

7. Ulož změny

### 3.3 Ověření ve Vercelu
- Vrať se do **Settings → Domains** ve Vercelu
- Vedle obou záznamů by se měl do 5–60 minut objevit zelený `Valid Configuration`
- Vercel automaticky vystaví SSL certifikát (Let's Encrypt) — to dělá sám, nic neřešíš

### 3.4 Redirect www → apex (nebo naopak)
Vercel implicitně přesměruje `www.veridion.cz` na `veridion.cz`. Pokud chceš opak (`veridion.cz` → `www.veridion.cz`), klikni u apex domény *Edit* a změň redirect target.

---

## 4. Dál

### Automatický redeploy
Každý `git push origin main` → automatický production deploy.

```bash
git add .
git commit -m "Update copy v hero"
git push
```

### Preview environments
Pull requesty automaticky dostávají vlastní preview URL (`veridion-pr-12-abc.vercel.app`). Užitečné při review obsahu.

### Analytics
Vercel má vestavěnou *Web Analytics* (privacy-friendly, bez cookies). Zapni v **Settings → Analytics**. Free tier postačí na launch.

### Custom 404 a další stránky
`app/not-found.tsx` zobrazí vlastní 404. Pro privacy / podmínky vytvoř `app/privacy/page.tsx` apod.

### Před launchem — kontrolní seznam
- [ ] Otestuj všechny sekce na mobile (375 px) a desktop (1440 px)
- [ ] Zkontroluj OG image — momentálně se generuje automaticky, doporučuju vytvořit vlastní (`app/opengraph-image.tsx`)
- [ ] Nastav v `app/layout.tsx` v `metadata` reálnou URL místo `veridion.ai`
- [ ] Připrav formulář pro „Request Access" (samostatná page nebo Tally / Typeform link)
- [ ] Cookie banner — landing page nepoužívá cookies, ale pokud zapneš Vercel Analytics, zvaž to

---

## Časový odhad

| Krok            | Reálný čas         |
|-----------------|--------------------|
| GitHub push     | 2 min              |
| Vercel deploy   | 3 min              |
| DNS v Active 24 | 5 min editace + 5–60 min propagace |
| SSL cert        | Automaticky, ~2 min po DNS         |

**Celkem:** doména naživo za 15–90 minut od teď.
