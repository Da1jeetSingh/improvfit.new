import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";

type EmptyStateProps = {
  title: string;
  description?: string;
  message: string;
};

export function EmptyState({ title, description, message }: EmptyStateProps) {
  return (
    <Card title={title} description={description} className={emptyCardClassName}>
      <p className="text-sm leading-relaxed text-muted">{message}</p>
    </Card>
  );
}
