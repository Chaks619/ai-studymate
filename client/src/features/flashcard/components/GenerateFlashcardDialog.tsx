import { useState } from "react";
import { Layers, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/usePreferences";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onGenerate: (count: number) => Promise<unknown>;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline";
}

const COUNT_OPTIONS = [5, 10, 15, 20, 25];

export function GenerateFlashcardsDialog({
  onGenerate,
  triggerLabel = "Generate flashcards",
  triggerVariant = "default",
}: Props) {
  const { preferences } = usePreferences();

  const [count, setCount] = useState(preferences.flashcardCount);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    // Re-seed from the saved default each time the dialog opens, so a one-off
    // override here doesn't quietly become the new default.
    if (next) {
      setCount(preferences.flashcardCount);
    }

    setOpen(next);
  }

  async function handleGenerate() {
    try {
      setLoading(true);

      await onGenerate(count);

      // Only dismiss on success — on failure the dialog stays open so the
      // user can retry without re-picking their options.
      setOpen(false);
    } catch {
      /* the caller surfaces the error */
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={triggerVariant}
            size={triggerVariant === "outline" ? "sm" : "lg"}
          >
            {triggerVariant === "outline" ? <RefreshCw /> : <Layers />}
            {triggerLabel}
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate flashcards</DialogTitle>

          <DialogDescription>
            Pick how many cards to create from this document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm font-medium text-foreground">Number of cards</p>

          <div className="grid grid-cols-5 gap-2">
            {COUNT_OPTIONS.map((option) => {
              const selected = count === option;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCount(option)}
                  className={cn(
                    "tabular flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            More cards give wider coverage but take longer to generate.
          </p>
        </div>

        <DialogFooter>
          <Button size="lg" disabled={loading} onClick={handleGenerate}>
            {loading ? (
              <>
                <RefreshCw className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles />
                Generate {count} cards
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
