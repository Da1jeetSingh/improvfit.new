"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  alertSuccessClassName,
  inputClassName,
  labelClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface/60 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
            About you
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="signup-name" className={labelClassName}>
                Full name
              </label>
              <input
                id="signup-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="Your name"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="signup-age" className={labelClassName}>
                Age
              </label>
              <input
                id="signup-age"
                name="age"
                type="number"
                inputMode="numeric"
                min={5}
                max={100}
                required
                placeholder="16"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="signup-mobile" className={labelClassName}>
                Mobile number
              </label>
              <input
                id="signup-mobile"
                name="mobile_number"
                type="tel"
                autoComplete="tel"
                required
                minLength={8}
                maxLength={20}
                placeholder="+44 7..."
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface/60 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
            Account
          </p>

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
              placeholder="you@example.com"
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
            <p className="mt-2 text-xs text-muted-subtle">
              At least 8 characters.
            </p>
          </div>
        </div>

        {state.error ? (
          <p className={alertErrorClassName} role="alert">
            {state.error}
          </p>
        ) : null}

        {state.message ? (
          <p className={alertSuccessClassName} role="status">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" fullWidth size="lg" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-subtle">
        Player-only performance OS. Built for disciplined athlete development.
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
