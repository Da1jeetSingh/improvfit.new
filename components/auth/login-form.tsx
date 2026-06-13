"use client";

import { useActionState } from "react";

import { login, type AuthActionState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

type AuthFormProps = {
  next?: string;
};

export function LoginForm({ next = "/dashboard" }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(
            "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2",
            "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
          )}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={cn(
            "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2",
            "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
          )}
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white",
          "hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
