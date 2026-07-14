import { toast } from "sonner";
import { RefreshCw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSettingsDraft } from "../SettingsDraftContext";

export function SettingsSaveBar() {
  const { isDirty, isSaving, save, discard } = useSettingsDraft();

  if (!isDirty) {
    return null;
  }

  async function handleSave() {
    const saved = await save();

    // A failed save already surfaced its own error toast, and the draft has
    // been rolled back — don't also claim success.
    if (saved) {
      toast.success("Settings saved");
    }
  }

  return (
    // Sticks to the bottom of the scroll container so the buttons stay
    // reachable no matter how far down the section you are.
    <div className="sticky bottom-0 z-10 -mx-1 px-1 pb-1">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:pl-4">
        <p className="text-sm text-muted-foreground">
          You have unsaved changes.
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={discard}
          >
            Discard
          </Button>

          <Button size="sm" disabled={isSaving} onClick={handleSave}>
            {isSaving ? (
              <>
                <RefreshCw className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
