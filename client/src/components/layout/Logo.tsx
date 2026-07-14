import { GraduationCap } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-7 w-7 text-primary" />

      <div>
        <p className="font-semibold">
          AI StudyMate
        </p>

        <p className="text-xs text-muted-foreground">
          Learn Smarter
        </p>
      </div>
    </div>
  );
}