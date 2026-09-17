import { BRAND_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function MainLayout({ children }: LayoutProps<"/main">) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-heading text-xl font-bold">{BRAND_NAME}</span>
        <LogoutButton />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">{children}</main>
    </div>
  );
}
