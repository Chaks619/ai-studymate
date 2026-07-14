import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

import { APP_VERSION, GITHUB_URL } from "../settings.constants";
import { SettingsField, SettingsSection } from "./SettingsSection";

export function AboutSection() {
  return (
    <SettingsSection
      title="About"
      description="What you're running, and where it lives."
    >
      <SettingsField
        label="Version"
        inline
        control={
          <span className="tabular text-sm text-muted-foreground">
            {APP_VERSION}
          </span>
        }
      />

      <SettingsField
        label="Source code"
        description="AI StudyMate is open source."
        inline
        control={
          <Button
            variant="outline"
            size="sm"
            render={
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
                <ExternalLink />
              </a>
            }
          />
        }
      />
    </SettingsSection>
  );
}
