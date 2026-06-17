"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup, type AuthActionState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  inputClassName,
  labelClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <>
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className={labelClassName}>
            Name
          </label>
          <input
            id="signup-name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
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
            min={5}
            max={100}
            inputMode="numeric"
            required
            placeholder="Your age"
            className={inputClassName}
          />
        </div>

        {state.error ? (
          <p className={alertErrorClassName} role="alert">
            {state.error}
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
