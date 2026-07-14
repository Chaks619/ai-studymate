import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AccentColor, FontSize, Theme } from "@/types/api/user.types";

import { useSettingsDraft } from "../SettingsDraftContext";
import {
  ACCENT_OPTIONS,
  FONT_SIZE_OPTIONS,
  THEME_OPTIONS,
} from "../settings.constants";
import {
  OptionGroup,
  SettingsField,
  SettingsSection,
} from "./SettingsSection";

export function AppearanceSection() {
  const { draft, edit } = useSettingsDraft();

  return (
    <SettingsSection
      title="Appearance"
      description="How AI StudyMate looks. Changes preview immediately, but only stick once you save."
    >
      <SettingsField
        label="Theme"
        description="System follows your operating system's setting."
      >
        <OptionGroup
          options={THEME_OPTIONS}
          value={draft.theme}
          onChange={(theme: Theme) => edit({ theme })}
          className="grid-cols-3"
        />
      </SettingsField>

      <SettingsField
        label="Accent colour"
        description="Used for buttons, links and selected states. Correct-answer green and error red stay as they are."
      >
        <div className="flex flex-wrap gap-2.5">
          {ACCENT_OPTIONS.map((option) => {
            const selected = option.value === draft.accentColor;

            return (
              <button
                key={option.value}
                type="button"
                title={option.label}
                aria-label={option.label}
                aria-pressed={selected}
                onClick={() =>
                  edit({ accentColor: option.value as AccentColor })
                }
                style={{ backgroundColor: option.swatch }}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full transition-all",
                  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  selected
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                    : "hover:scale-105"
                )}
              >
                {selected ? (
                  <Check className="size-4 text-white" strokeWidth={3} />
                ) : null}
              </button>
            );
          })}
        </div>
      </SettingsField>

      <SettingsField
        label="Font size"
        description="Scales the whole interface, not just the text."
      >
        <OptionGroup
          options={FONT_SIZE_OPTIONS}
          value={draft.fontSize}
          onChange={(fontSize: FontSize) => edit({ fontSize })}
          className="grid-cols-3"
        />
      </SettingsField>
    </SettingsSection>
  );
}
