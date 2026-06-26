"use client";

import Link from "next/link";
import { useActionState } from "react";

import { updatePassword, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  inputClassName,
  labelClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";

const initialState: AuthActionState = {};

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <>
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="new-password" className={labelClassName}>
            New password
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className={labelClassName}>
            Confirm password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClassName}
          />
          <p className="mt-2 text-xs text-muted-subtle">At least 8 characters.</p>
        </div>

        {state.error ? (
          <p className={alertErrorClassName} role="alert">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" fullWidth size="lg" disabled={isPending}>
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Link expired?{" "}
        <Link href="/auth/forgot-password" className={sectionLinkClassName}>
          Request a new reset link
        </Link>
      </p>
    </>
  );
}
