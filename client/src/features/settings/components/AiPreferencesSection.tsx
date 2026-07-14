import type {
  AiTone,
  QuizDifficulty,
  SummaryLength,
} from "@/types/api/user.types";

import { useSettingsDraft } from "../SettingsDraftContext";
import {
  AI_TONE_OPTIONS,
  FLASHCARD_COUNT_OPTIONS,
  QUESTION_COUNT_OPTIONS,
  QUIZ_DIFFICULTY_OPTIONS,
  SUMMARY_LENGTH_OPTIONS,
} from "../settings.constants";
import {
  CountGroup,
  OptionGroup,
  SettingsField,
  SettingsSection,
} from "./SettingsSection";

export function AiPreferencesSection() {
  const { draft, edit } = useSettingsDraft();

  return (
    <SettingsSection
      title="AI preferences"
      description="Defaults for everything AI StudyMate generates. The generate dialogs start from these, and you can still override them per document."
    >
      <SettingsField
        label="Summary length"
        description="How much detail a generated summary keeps."
      >
        <OptionGroup
          options={SUMMARY_LENGTH_OPTIONS}
          value={draft.summaryLength}
          onChange={(summaryLength: SummaryLength) => edit({ summaryLength })}
          className="grid-cols-1 sm:grid-cols-3"
        />
      </SettingsField>

      <SettingsField
        label="Default quiz length"
        description="Pre-selected when you open the generate quiz dialog."
      >
        <CountGroup
          options={QUESTION_COUNT_OPTIONS}
          value={draft.quizQuestionCount}
          onChange={(quizQuestionCount) => edit({ quizQuestionCount })}
        />
      </SettingsField>

      <SettingsField label="Default quiz difficulty">
        <OptionGroup
          options={QUIZ_DIFFICULTY_OPTIONS}
          value={draft.quizDifficulty}
          onChange={(quizDifficulty: QuizDifficulty) => edit({ quizDifficulty })}
          className="grid-cols-2 sm:grid-cols-4"
        />
      </SettingsField>

      <SettingsField
        label="Default flashcard count"
        description="More cards give wider coverage but take longer to generate."
      >
        <CountGroup
          options={FLASHCARD_COUNT_OPTIONS}
          value={draft.flashcardCount}
          onChange={(flashcardCount) => edit({ flashcardCount })}
        />
      </SettingsField>

      <SettingsField
        label="Tone"
        description="Sets the voice of every summary, flashcard and quiz explanation."
      >
        <OptionGroup
          options={AI_TONE_OPTIONS}
          value={draft.aiTone}
          onChange={(aiTone: AiTone) => edit({ aiTone })}
          className="grid-cols-1 sm:grid-cols-2"
        />
      </SettingsField>
    </SettingsSection>
  );
}
