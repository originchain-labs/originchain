"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return <p className="p-6 text-sm text-zinc-500">Checking authentication…</p>;
  return <>{children}</>;
}
