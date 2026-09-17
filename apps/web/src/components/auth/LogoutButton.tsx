"use client";

import { Button } from "@/components/ui";
import { useLogout } from "@/lib/hooks";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button variant="outline" onClick={logout}>
      Log out
    </Button>
  );
}
