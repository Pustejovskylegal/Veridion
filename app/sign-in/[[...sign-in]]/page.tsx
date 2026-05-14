import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Vítejte zpět."
      subtitle="Přihlaste se do svého workspacu pro správu veřejných zakázek."
    >
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-0 p-0",
            header: "hidden",
            footer: "mt-6",
          },
        }}
      />
    </AuthShell>
  );
}
