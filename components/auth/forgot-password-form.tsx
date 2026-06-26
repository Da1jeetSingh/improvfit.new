"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  alertSuccessClassName,
  inputClassName,
  labelClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <>
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="reset-email" className={labelClassName}>
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClassName}
          />
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
          {isPending ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href="/login" className={sectionLinkClassName}>
          Log in
        </Link>
      </p>
    </>
  );
}
