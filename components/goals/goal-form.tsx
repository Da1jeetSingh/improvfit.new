"use client";

import { useActionState, useState } from "react";

import { AchievementUnlockToast } from "@/components/achievements/achievement-unlock-toast";
import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { useCoachSaveFeedback } from "@/components/coach/use-coach-save-feedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  alertErrorClassName,
  alertSuccessClassName,
  formatLabel,
  inputClassName,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  getDefaultGoalCategory,
  getGoalCategoryOptions,
} from "@/lib/logging/role-fields";
import {
  createGoal,
  updateGoal,
  type GoalActionState,
} from "@/lib/goals/actions";
import { cn } from "@/lib/utils";
import {
  formatGoalCategory,
  goalStatuses,
  type Goal,
} from "@/types/goal";
import type { PlayerRole } from "@/types/profile";

const initialState: GoalActionState = {};

type GoalFormProps = {
  goal?: Goal;
  role?: PlayerRole | null;
  variant?: "page" | "modal";
  onSuccess?: () => void;
};

export function GoalForm({
  goal,
  role = null,
  variant = "page",
  onSuccess,
}: GoalFormProps) {
  const action = goal ? updateGoal : createGoal;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const categoryOptions = getGoalCategoryOptions(role);
  const defaultCategory = goal?.category ?? getDefaultGoalCategory(role);
  const isCreateModal = variant === "modal" && !goal;

  useCoachSaveFeedback({
    coachMessage: state.coachMessage,
    achievementUnlocks: state.achievementUnlocks,
    fallbackMessage: state.message,
    variant,
    onSuccess,
  });

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="title" className={labelClassName}>
          Goal title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Example: Score 300 runs this month"
          defaultValue={goal?.title ?? ""}
          className={inputClassName}
        />
      </div>

      {!isCreateModal ? (
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClassName}>
            Goal description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What does success look like for this goal?"
            defaultValue={goal?.description ?? ""}
            className={cn(inputClassName, "resize-y")}
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="category" className={labelClassName}>
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaultCategory}
          className={inputClassName}
        >
          <option value="">Select category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {formatGoalCategory(category)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="due_date" className={labelClassName}>
          Deadline date
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          defaultValue={goal?.due_date ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="target_value" className={labelClassName}>
          Target value
        </label>
        <input
          id="target_value"
          name="target_value"
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          placeholder="300"
          defaultValue={goal?.target_value ?? ""}
          className={inputClassName}
        />
      </div>

      {!isCreateModal ? (
        <>
          <div>
            <label htmlFor="target_outcome" className={labelClassName}>
              Target outcome
            </label>
            <input
              id="target_outcome"
              name="target_outcome"
              type="text"
              placeholder="Example: Make the 1st XI"
              defaultValue={goal?.target_outcome ?? ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="current_value" className={labelClassName}>
              Current progress value
            </label>
            <input
              id="current_value"
              name="current_value"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              defaultValue={goal?.current_value ?? 0}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClassName}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={goal?.status ?? "not_started"}
              className={inputClassName}
            >
              {goalStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <input type="hidden" name="status" value="not_started" />
      )}
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      {goal ? <input type="hidden" name="goal_id" value={goal.id} /> : null}

      {variant === "page" ? (
        <Card
          badge="Target setting"
          title={goal ? "Edit goal" : "Create a new goal"}
          description="Set a target and track your progress over time."
        >
          {fields}
        </Card>
      ) : (
        fields
      )}

      {state.error ? (
        <p className={alertErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.achievementUnlocks?.length ? (
        <AchievementUnlockToast unlocks={state.achievementUnlocks} compact />
      ) : null}

      {state.coachMessage ? (
        <CoachMessageCard
          message={{ text: state.coachMessage, label: "Coach" }}
          compact
        />
      ) : null}

      {state.message &&
      variant === "page" &&
      !state.coachMessage &&
      !state.achievementUnlocks?.length ? (
        <p className={alertSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={
          isPending ||
          Boolean(
            (state.coachMessage || state.achievementUnlocks?.length) &&
              variant === "modal",
          )
        }
        fullWidth={variant === "modal"}
      >
        {isPending ? "Saving..." : goal ? "Update goal" : "Save goal"}
      </Button>
    </form>
  );
}

type AddGoalButtonProps = {
  role: PlayerRole | null;
};

export function AddGoalButton({ role }: AddGoalButtonProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleSuccess() {
    setOpen(false);
    setFormKey((current) => current + 1);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Goal
      </Button>

      <Modal
        open={open}
        title="Add Goal"
        description="Set a target with a deadline and progress number."
        onClose={() => setOpen(false)}
      >
        <GoalForm
          key={formKey}
          role={role}
          variant="modal"
          onSuccess={handleSuccess}
        />
      </Modal>
    </>
  );
}
