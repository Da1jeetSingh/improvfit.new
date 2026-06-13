"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { inputClassName, labelClassName, sectionLinkClassName } from "@/components/ui/form-styles";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <>
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="signup-email" className={labelClassName}>
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className={labelClassName}>
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClassName}
          />
          <p className="mt-2 text-xs text-muted">At least 8 characters.</p>
        </div>

        {state.error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        {state.message ? (
          <p className="rounded-xl bg-green-muted px-4 py-3 text-sm font-medium text-green-deep" role="status">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" fullWidth size="lg" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-muted">
        Player-only app. No coaches or academies.
      </p>

      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className={sectionLinkClassName}>
          Log in
        </Link>
      </p>
    </>
  );
}
