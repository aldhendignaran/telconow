"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-left text-sm font-medium text-text-onDarkMuted transition-colors hover:text-text-inverse"
    >
      ← Log out
    </button>
  );
}
