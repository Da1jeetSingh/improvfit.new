"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  inputClassName,
  labelClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";

export function DemoSignupForm() {
  return (
    <>
      <form
        className="space-y-5"
        onSubmit={(event) => event.preventDefault()}
        data-video-demo="signup-form"
      >
        <div>
          <label htmlFor="demo-signup-email" className={labelClassName}>
            Email
          </label>
          <input
            id="demo-signup-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue=""
            data-video-demo="email-input"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="demo-signup-password" className={labelClassName}>
            Password
          </label>
          <input
            id="demo-signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            defaultValue=""
            data-video-demo="password-input"
            className={inputClassName}
          />
          <p className="mt-2 text-xs text-muted-subtle">At least 8 characters.</p>
        </div>

        <Button type="submit" fullWidth size="lg" data-video-demo="submit-btn">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-subtle">
        Player-only performance OS. Built for disciplined athlete development.
      </p>

      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/video-demo/signup" className={sectionLinkClassName}>
          Log in
        </Link>
      </p>
    </>
  );
}
