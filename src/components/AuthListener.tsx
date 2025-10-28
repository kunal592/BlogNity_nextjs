// src/components/AuthListener.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function AuthListener() {
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const name = session?.user?.name ?? "User";
      toast.success(`Welcome back, ${name}!`);
    }
  }, [status, session]);

  return null;
}
