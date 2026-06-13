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
      <div className="mb-6 flex rounded-xl border-2 border-border p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
            tab === "login"
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground",
          )}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
            tab === "signup"
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground",
          )}
        >
          Sign up
        </button>
      </div>

      {callbackError ? (
        <p className="mb-4 text-sm text-red-600" role="alert">
          Sign-in could not be completed. Please try again.
        </p>
      ) : null}

      {tab === "login" ? (
        <form action={loginAction} className="space-y-4">
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
            <p className="text-sm text-red-600" role="alert">
              {loginState.error}
            </p>
          ) : null}
          <Button type="submit" fullWidth disabled={loginPending}>
            {loginPending ? "Signing in..." : "Log in"}
          </Button>
        </form>
      ) : (
        <form action={signupAction} className="space-y-4">
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
            <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
          </div>
          {signupState.error ? (
            <p className="text-sm text-red-600" role="alert">
              {signupState.error}
            </p>
          ) : null}
          {signupState.message ? (
            <p className="text-sm text-green-deep" role="status">
              {signupState.message}
            </p>
          ) : null}
          <Button type="submit" fullWidth disabled={signupPending}>
            {signupPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        Player-only app. No coaches or academies.
      </p>
    </div>
  );
}
