import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      heading="Make an account, make a plan."
      subheading='Faster than typing "when is everyone free".'
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
