import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";

type AuthSplitLayoutProps = {
  heading: string;
  subheading: string;
  children: React.ReactNode;
};

export function AuthSplitLayout({ heading, subheading, children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-marketing-cream md:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-8 px-6 py-12 sm:px-12 lg:px-20">
        <Link href="/" className="font-heading text-2xl font-bold text-marketing-ink">
          {BRAND_NAME}
        </Link>
        <div className="flex max-w-md flex-col gap-2">
          <h1 className="font-heading text-4xl leading-tight font-bold text-marketing-ink sm:text-5xl">
            {heading}
          </h1>
          <p className="text-muted-foreground">{subheading}</p>
        </div>
        <div className="max-w-md">{children}</div>
      </div>
      <div
        className="relative hidden flex-1 bg-marketing-pink md:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 18px)",
        }}
      />
    </div>
  );
}
