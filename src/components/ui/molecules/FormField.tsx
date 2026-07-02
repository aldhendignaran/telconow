import { Label } from "@/components/ui/atoms/Label";
import { Input } from "@/components/ui/atoms/Input";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  error?: string;
}

export function FormField({ id, label, type, error, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} error={error} {...inputProps} />
    </div>
  );
}
