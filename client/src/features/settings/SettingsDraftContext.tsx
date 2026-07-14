import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useTheme } from "next-themes";

import { applyAppearance } from "@/lib/appearance";
import type {
  AutoGeneratePreferences,
  UpdatePreferencesRequest,
  UserPreferences,
} from "@/types/api/user.types";

import { usePreferences } from "./hooks/usePreferences";

/** Every preference the settings form owns, minus the nested autoGenerate. */
const SCALAR_KEYS = [
  "theme",
  "accentColor",
  "fontSize",
  "summaryLength",
  "quizQuestionCount",
  "quizDifficulty",
  "flashcardCount",
  "aiTone",
  "studyLevel",
] as const satisfies readonly (keyof UserPreferences)[];

const AUTO_GENERATE_KEYS = [
  "summary",
  "flashcards",
  "quiz",
] as const satisfies readonly (keyof AutoGeneratePreferences)[];

function arePreferencesEqual(a: UserPreferences, b: UserPreferences): boolean {
  return (
    a.theme === b.theme &&
    a.accentColor === b.accentColor &&
    a.fontSize === b.fontSize &&
    a.summaryLength === b.summaryLength &&
    a.quizQuestionCount === b.quizQuestionCount &&
    a.quizDifficulty === b.quizDifficulty &&
    a.flashcardCount === b.flashcardCount &&
    a.aiTone === b.aiTone &&
    a.studyLevel === b.studyLevel &&
    a.autoGenerate.summary === b.autoGenerate.summary &&
    a.autoGenerate.flashcards === b.autoGenerate.flashcards &&
    a.autoGenerate.quiz === b.autoGenerate.quiz
  );
}

interface SettingsDraft {
  draft: UserPreferences;
  edit: (patch: UpdatePreferencesRequest) => void;
  isDirty: boolean;
  isSaving: boolean;
  /** Resolves to false when the save failed. */
  save: () => Promise<boolean>;
  discard: () => void;
}

const SettingsDraftContext = createContext<SettingsDraft | null>(null);

export function useSettingsDraft(): SettingsDraft {
  const context = useContext(SettingsDraftContext);

  if (!context) {
    throw new Error(
      "useSettingsDraft must be used inside a SettingsDraftProvider"
    );
  }

  return context;
}

/**
 * Holds the settings form's unsaved state. Nothing reaches the server until
 * Save is pressed — but appearance is previewed live off the draft, so you can
 * see a theme or accent before committing to it. Leaving the page or pressing
 * Discard rolls that preview back to what is actually saved.
 */
export function SettingsDraftProvider({ children }: PropsWithChildren) {
  const { preferences, savePreferences, isSaving } = usePreferences();

  const { setTheme } = useTheme();

  const [draft, setDraft] = useState<UserPreferences>(preferences);

  // What the server currently holds. Kept in a ref so the unmount cleanup can
  // read the latest value without re-subscribing.
  const savedRef = useRef(preferences);

  useEffect(() => {
    const previousSaved = savedRef.current;

    savedRef.current = preferences;

    if (arePreferencesEqual(previousSaved, preferences)) {
      return;
    }

    // Something saved a preference from outside this form — the header theme
    // toggle is the one that can. Adopt each field that changed, but only where
    // the draft hadn't already overridden it, so a three-way merge rather than
    // clobbering unsaved edits in either direction.
    setDraft((current) => {
      const merged = { ...current };

      for (const key of SCALAR_KEYS) {
        if (
          previousSaved[key] !== preferences[key] &&
          current[key] === previousSaved[key]
        ) {
          Object.assign(merged, { [key]: preferences[key] });
        }
      }

      for (const key of AUTO_GENERATE_KEYS) {
        if (
          previousSaved.autoGenerate[key] !== preferences.autoGenerate[key] &&
          current.autoGenerate[key] === previousSaved.autoGenerate[key]
        ) {
          merged.autoGenerate = {
            ...merged.autoGenerate,
            [key]: preferences.autoGenerate[key],
          };
        }
      }

      return arePreferencesEqual(merged, current) ? current : merged;
    });
  }, [preferences]);

  const { theme, accentColor, fontSize } = draft;

  useEffect(() => {
    applyAppearance({ accentColor, fontSize });

    setTheme(theme);
  }, [theme, accentColor, fontSize, setTheme]);

  // On the way out, drop any preview that was never saved.
  useEffect(() => {
    return () => {
      const saved = savedRef.current;

      applyAppearance({
        accentColor: saved.accentColor,
        fontSize: saved.fontSize,
      });

      setTheme(saved.theme);
    };
  }, [setTheme]);

  const edit = useCallback((patch: UpdatePreferencesRequest) => {
    setDraft((current) => ({
      ...current,
      ...patch,
      autoGenerate: {
        ...current.autoGenerate,
        ...patch.autoGenerate,
      },
    }));
  }, []);

  const discard = useCallback(() => {
    setDraft(savedRef.current);
  }, []);

  const isDirty = !arePreferencesEqual(draft, preferences);

  const save = useCallback(() => {
    return savePreferences({
      theme: draft.theme,
      accentColor: draft.accentColor,
      fontSize: draft.fontSize,
      summaryLength: draft.summaryLength,
      quizQuestionCount: draft.quizQuestionCount,
      quizDifficulty: draft.quizDifficulty,
      flashcardCount: draft.flashcardCount,
      aiTone: draft.aiTone,
      studyLevel: draft.studyLevel,
      autoGenerate: draft.autoGenerate,
    });
  }, [draft, savePreferences]);

  const value = useMemo(
    () => ({ draft, edit, isDirty, isSaving, save, discard }),
    [draft, edit, isDirty, isSaving, save, discard]
  );

  return (
    <SettingsDraftContext.Provider value={value}>
      {children}
    </SettingsDraftContext.Provider>
  );
}
