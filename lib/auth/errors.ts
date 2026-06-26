import type { AuthError } from "@supabase/supabase-js";

export function mapLoginError(error: AuthError) {
  if (error.code === "email_not_confirmed") {
    return "Confirm your email before signing in. Check your inbox for the confirmation link.";
  }

  if (error.code === "invalid_credentials") {
    return "Invalid email or password. If you just signed up, confirm your email first or use Forgot password.";
  }

  return error.message;
}

export function mapSignupError(error: AuthError) {
  if (error.code === "user_already_exists") {
    return "An account with this email already exists. Log in instead, or reset your password.";
  }

  return error.message;
}
