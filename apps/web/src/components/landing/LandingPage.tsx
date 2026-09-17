import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { BRAND_NAME } from "@/lib/constants";

export function LandingPage() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-marketing-pink px-6 py-10 sm:px-12 sm:py-16">
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-marketing-olive/70" />

      <header className="relative z-10 flex items-start justify-between">
        <span className="font-heading text-2xl font-bold text-marketing-ink">{BRAND_NAME}</span>
        <div className="flex flex-col items-end gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-5 text-marketing-ink hover:bg-white/90"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <span className="hidden rotate-6 rounded-full bg-marketing-ink px-4 py-2 font-mono text-xs text-white sm:block">
            no group chat chaos.
          </span>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-8 text-center">
        <h1 className="font-heading text-4xl leading-tight font-bold text-balance text-marketing-ink sm:text-6xl">
          Someone has to plan it.
          <br />
          Be{" "}
          <span className="rounded-full bg-marketing-olive px-2 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
            that someone.
          </span>
        </h1>
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full bg-marketing-ink px-6 text-base text-white hover:bg-marketing-ink/90"
        >
          <Link href="/register">
            Start a trip <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </main>
  );
}
