import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { MemoryMatchGame } from "../components/MemoryMatchGame";

export function MemoryMatchPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/minigames")}
          >
            <ArrowLeft className="size-4" />
            Minigames
          </Button>

          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Memory Match
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Flip cards to find pairs — solo against the clock,
              or take turns against the AI.
            </p>
          </div>
        </div>

        <MemoryMatchGame />
      </div>
    </DashboardLayout>
  );
}
