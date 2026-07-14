import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";

import { useAppSelector } from "@/app/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
  useChangePasswordMutation,
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/services/api/user.api";

import {
  passwordSchema,
  profileSchema,
  type PasswordForm,
  type ProfileForm,
} from "../settings.schema";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { SettingsField, SettingsSection } from "./SettingsSection";

function AvatarField() {
  const user = useAppSelector((state) => state.auth.user);

  const inputRef = useRef<HTMLInputElement>(null);

  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Reset immediately so picking the same file twice still fires a change.
    event.target.value = "";

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateAvatar(formData).unwrap();

      toast.success("Profile picture updated");
    } catch {
      toast.error("Couldn't upload that image. PNG, JPEG or WebP, up to 5MB.");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        {user?.avatar?.url ? (
          <AvatarImage src={user.avatar.url} alt={user.name} />
        ) : null}

        <AvatarFallback className="text-lg">
          {user?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera />
          {isLoading ? "Uploading…" : "Change photo"}
        </Button>

        <p className="mt-1.5 text-xs text-muted-foreground">
          PNG, JPEG or WebP. Up to 5MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

function ProfileFields() {
  const user = useAppSelector((state) => state.auth.user);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "" },
  });

  async function onSubmit(data: ProfileForm) {
    try {
      await updateProfile(data).unwrap();

      reset(data);

      toast.success("Name updated");
    } catch {
      toast.error("Couldn't update your name. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input id="name" {...register("name")} />

        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input id="email" value={user?.email ?? ""} disabled readOnly />

        <p className="text-xs text-muted-foreground">
          Your email is how you sign in and can't be changed here.
        </p>
      </div>

      <Button type="submit" size="sm" disabled={!isDirty || isLoading}>
        {isLoading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordFields() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const logout = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordForm) {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      reset();

      toast.success("Password changed. Please sign in again.");

      // The server revoked the refresh token, so every session — including
      // this one — is now dead. Send them to the login screen rather than
      // letting the app fail on the next request.
      await logout();
    } catch {
      toast.error("Couldn't change your password. Check your current one.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>

        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />

        {errors.currentPassword ? (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>

          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />

          {errors.newPassword ? (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>

          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword ? (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? "Changing…" : "Change password"}
      </Button>
    </form>
  );
}

export function AccountSection() {
  return (
    <div className="space-y-6">
      <SettingsSection
        title="Account"
        description="Your profile and how you sign in."
      >
        <SettingsField label="Profile picture">
          <AvatarField />
        </SettingsField>

        <ProfileFields />
      </SettingsSection>

      <SettingsSection
        title="Password"
        description="Changing your password signs you out everywhere, including here."
      >
        <PasswordFields />
      </SettingsSection>

      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-destructive/25 sm:p-6">
        <header className="mb-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-destructive">
            Danger zone
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Deleting your account removes every workspace, document and
            generation. There is no way back.
          </p>
        </header>

        <DeleteAccountDialog />
      </section>
    </div>
  );
}
