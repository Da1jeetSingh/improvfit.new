"use client";

import { useActionState } from "react";

import { signup, type AuthActionState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
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
          autoComplete="new-password"
          minLength={8}
          required
          className={cn(
            "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2",
            "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
          )}
        />
        <p className="mt-1 text-sm text-zinc-500">At least 8 characters.</p>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className="text-sm text-emerald-700" role="status">
          {state.message}
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
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
