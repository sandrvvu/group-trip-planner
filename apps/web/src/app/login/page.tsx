import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthSplitLayout heading="Welcome back." subheading="Three people voted while you were gone.">
      <LoginForm />
    </AuthSplitLayout>
  );
}
