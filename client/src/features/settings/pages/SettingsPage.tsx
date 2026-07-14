import { Navigate, useParams } from "react-router-dom";

import { DashboardLayout } from "@/layouts/DashboardLayout";

import { SettingsDraftProvider } from "../SettingsDraftContext";
import { AboutSection } from "../components/AboutSection";
import { AccountSection } from "../components/AccountSection";
import { AiPreferencesSection } from "../components/AiPreferencesSection";
import { AppearanceSection } from "../components/AppearanceSection";
import { SettingsSaveBar } from "../components/SettingsSaveBar";
import { StudyPreferencesSection } from "../components/StudyPreferencesSection";
import {
  DEFAULT_SETTINGS_SECTION,
  SETTINGS_SECTIONS,
} from "../settings.constants";

const PANELS: Record<string, () => JSX.Element> = {
  appearance: AppearanceSection,
  ai: AiPreferencesSection,
  study: StudyPreferencesSection,
  account: AccountSection,
  about: AboutSection,
};

export function SettingsPage() {
  const { section } = useParams();

  const meta = SETTINGS_SECTIONS.find((item) => item.slug === section);

  // A hand-typed or stale /settings/whatever shouldn't render an empty page.
  if (!meta) {
    return <Navigate to={`/settings/${DEFAULT_SETTINGS_SECTION}`} replace />;
  }

  const Panel = PANELS[meta.slug];

  return (
    <DashboardLayout>
      {/*
        The provider wraps the panel rather than living inside it, so unsaved
        changes and the save bar survive moving between sections in the sidebar.
      */}
      <SettingsDraftProvider>
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <header>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Settings
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              These apply to your account on every device you sign in on.
            </p>
          </header>

          <Panel />

          <SettingsSaveBar />
        </div>
      </SettingsDraftProvider>
    </DashboardLayout>
  );
}
