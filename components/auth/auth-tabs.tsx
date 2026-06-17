"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { inputClassName, labelClassName } from "@/components/ui/form-styles";
import { login, signup, type AuthActionState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

type AuthTabsProps = {
  next?: string;
  defaultTab?: "login" | "signup";
  callbackError?: boolean;
};

export function AuthTabs({
  next = "/dashboard",
  defaultTab = "login",
  callbackError,
}: AuthTabsProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loginState, loginAction, loginPending] = useActionState(login, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  return (
    <div>
      <div className="mb-8 flex rounded-2xl border border-border-subtle bg-green-tint p-1.5">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={cn(
            "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
            tab === "login"
              ? "bg-surface-raised text-foreground shadow-soft"
              : "text-muted hover:text-foreground",
          )}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={cn(
            "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
            tab === "signup"
              ? "bg-surface-raised text-foreground shadow-soft"
              : "text-muted hover:text-foreground",
          )}
        >
          Sign up
        </button>
      </div>

      {callbackError ? (
        <p className="mb-4 rounded-xl border border-red-200/60 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Sign-in could not be completed. Please try again.
        </p>
      ) : null}

      {tab === "login" ? (
        <form action={loginAction} className="space-y-5">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="login-email" className={labelClassName}>
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelClassName}>
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClassName}
            />
          </div>
          {loginState.error ? (
            <p className="rounded-xl border border-red-200/60 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {loginState.error}
            </p>
          ) : null}
          <Button type="submit" fullWidth size="lg" disabled={loginPending}>
            {loginPending ? "Signing in..." : "Log in"}
          </Button>
        </form>
      ) : (
        <form action={signupAction} className="space-y-5">
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
          {signupState.error ? (
            <p className="rounded-xl border border-red-200/60 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {signupState.error}
            </p>
          ) : null}
          <Button type="submit" fullWidth size="lg" disabled={signupPending}>
            {signupPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-xs text-muted-subtle">
        Player-only performance OS. Built for disciplined athlete development.
      </p>
    </div>
  );
}
