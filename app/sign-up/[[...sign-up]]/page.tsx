import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Vytvořte si účet."
      subtitle="Zaregistrujte se a získejte přístup do Veridion workspacu."
    >
      <SignUp
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
