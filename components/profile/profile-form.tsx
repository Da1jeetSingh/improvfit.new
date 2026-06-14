"use client";

import { useActionState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import { saveProfile, type ProfileActionState } from "@/lib/profile/actions";
import { cn } from "@/lib/utils";
import {
  battingStyles,
  bowlingStyles,
  playerRoles,
  skillLevels,
  type PlayerProfile,
} from "@/types/profile";

const initialState: ProfileActionState = {};

type ProfileFormProps = {
  profile: PlayerProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveProfile,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card
        title="Basic details"
        description="Your name, age, and primary role on the field."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className={labelClassName}>
              Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              defaultValue={profile.full_name ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="age" className={labelClassName}>
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min={5}
              max={100}
              inputMode="numeric"
              defaultValue={profile.age ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="role" className={labelClassName}>
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue={profile.role ?? ""}
              className={inputClassName}
            >
              <option value="">Select a role</option>
              {playerRoles.map((role) => (
                <option key={role} value={role}>
                  {formatLabel(role)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card
        title="Playing style"
        description="How you bat, bowl, and where you are in your cricket journey."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="batting_style" className={labelClassName}>
              Batting style
            </label>
            <select
              id="batting_style"
              name="batting_style"
              defaultValue={profile.batting_style ?? ""}
              className={inputClassName}
            >
              <option value="">Select batting style</option>
              {battingStyles.map((style) => (
                <option key={style} value={style}>
                  {formatLabel(style)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bowling_style" className={labelClassName}>
              Bowling style
            </label>
            <select
              id="bowling_style"
              name="bowling_style"
              defaultValue={profile.bowling_style ?? ""}
              className={inputClassName}
            >
              <option value="">Select bowling style</option>
              {bowlingStyles.map((style) => (
                <option key={style} value={style}>
                  {formatLabel(style)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="skill_level" className={labelClassName}>
              Skill level
            </label>
            <select
              id="skill_level"
              name="skill_level"
              defaultValue={profile.skill_level ?? ""}
              className={inputClassName}
            >
              <option value="">Select skill level</option>
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {formatLabel(level)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Main goal" description="What you are working toward this season.">
        <div>
          <label htmlFor="personal_goals" className={labelClassName}>
            Main goal
          </label>
          <textarea
            id="personal_goals"
            name="personal_goals"
            rows={4}
            defaultValue={profile.personal_goals ?? ""}
            placeholder="Example: Score more runs in the top order and improve death bowling."
            className={cn(inputClassName, "resize-y")}
          />
        </div>
      </Card>

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

      <Button type="submit" disabled={isPending} fullWidth className="sm:w-auto">
        {isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
