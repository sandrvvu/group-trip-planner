"use client";

import { useCurrentUser } from "@/queries";

export default function MainPage() {
  const { data: user, isPending, isError } = useCurrentUser();

  if (isPending) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (isError) {
    return <p className="text-muted-foreground">Couldn&apos;t load your session.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="font-heading text-3xl font-bold">You&apos;re in, {user.name}</h1>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
}
