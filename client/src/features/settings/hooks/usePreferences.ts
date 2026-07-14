import { toast } from "sonner";

import { useAppSelector } from "@/app/hooks";
import { useUpdatePreferencesMutation } from "@/services/api/user.api";
import {
  DEFAULT_PREFERENCES,
  type UpdatePreferencesRequest,
  type UserPreferences,
} from "@/types/api/user.types";

interface UsePreferences {
  preferences: UserPreferences;
  /** Resolves to false when the save failed; the error toast is already shown. */
  savePreferences: (patch: UpdatePreferencesRequest) => Promise<boolean>;
  isSaving: boolean;
}

/**
 * Reads preferences off the cached user rather than its own query — the
 * session restore already carries them, so settings render with no fetch.
 * Saving is optimistic (see user.api), so callers don't need to hold
 * pending UI state of their own.
 */
export function usePreferences(): UsePreferences {
  const user = useAppSelector((state) => state.auth.user);

  const [updatePreferences, { isLoading }] = useUpdatePreferencesMutation();

  const preferences = user?.preferences ?? DEFAULT_PREFERENCES;

  async function savePreferences(patch: UpdatePreferencesRequest) {
    try {
      await updatePreferences(patch).unwrap();

      return true;
    } catch {
      toast.error("Couldn't save your settings. Please try again.");

      return false;
    }
  }

  return {
    preferences,
    savePreferences,
    isSaving: isLoading,
  };
}
