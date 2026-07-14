import { Layers, ListChecks, Sparkles, type LucideIcon } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type {
  AutoGeneratePreferences,
  StudyLevel,
} from "@/types/api/user.types";

import { useSettingsDraft } from "../SettingsDraftContext";
import { STUDY_LEVEL_OPTIONS } from "../settings.constants";
import {
  OptionGroup,
  SettingsField,
  SettingsSection,
} from "./SettingsSection";

const AUTO_GENERATE_ITEMS: {
  key: keyof AutoGeneratePreferences;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    key: "summary",
    label: "Summary",
    description: "Distil the document as soon as it finishes processing",
    icon: Sparkles,
  },
  {
    key: "flashcards",
    label: "Flashcards",
    description: "Build a deck using your default card count",
    icon: Layers,
  },
  {
    key: "quiz",
    label: "Quiz",
    description: "Create a quiz using your default length and difficulty",
    icon: ListChecks,
  },
];

export function StudyPreferencesSection() {
  const { draft, edit } = useSettingsDraft();

  return (
    <SettingsSection
      title="Study preferences"
      description="How AI StudyMate pitches material at you, and what it prepares without being asked."
    >
      <SettingsField
        label="Study level"
        description="Sets how much prior knowledge the AI assumes you have."
      >
        <OptionGroup
          options={STUDY_LEVEL_OPTIONS}
          value={draft.studyLevel}
          onChange={(studyLevel: StudyLevel) => edit({ studyLevel })}
          className="grid-cols-1 sm:grid-cols-3"
        />
      </SettingsField>

      <SettingsField
        label="Auto-generate on upload"
        description="Runs the moment a new PDF finishes processing. Each one costs a generation, so turn on only what you'll actually read."
      >
        <div className="divide-y divide-border rounded-lg border border-border">
          {AUTO_GENERATE_ITEMS.map(({ key, label, description, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 px-3.5 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>

              <Switch
                aria-label={`Auto-generate ${label.toLowerCase()}`}
                checked={draft.autoGenerate[key]}
                onCheckedChange={(checked) =>
                  edit({ autoGenerate: { [key]: checked } })
                }
              />
            </div>
          ))}
        </div>
      </SettingsField>
    </SettingsSection>
  );
}
