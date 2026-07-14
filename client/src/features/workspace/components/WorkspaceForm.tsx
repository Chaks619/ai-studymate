import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  workspaceSchema,
  type WorkspaceFormData,
} from "../workspace.schema";

interface WorkspaceFormProps {
  onSubmit: (data: WorkspaceFormData) => Promise<void> | void;
  isLoading?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<WorkspaceFormData>;
}

export function WorkspaceForm({
  onSubmit,
  isLoading = false,
  submitLabel = "Create Workspace",
  defaultValues,
}: WorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),

    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "book",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Workspace Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Workspace Name</Label>

        <Input
          id="name"
          placeholder="Operating Systems"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Input
          id="description"
          placeholder="Semester 5 Notes"
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>

        <Input
          id="color"
          type="color"
          className="h-10 w-20 p-1"
          {...register("color")}
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>

        <Input
          id="icon"
          placeholder="book"
          {...register("icon")}
        />

        {errors.icon && (
          <p className="text-sm text-red-500">
            {errors.icon.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}