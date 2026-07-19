import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { SpeedMathGame } from "../components/SpeedMathGame";

export function SpeedMathPage() {
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
              Speed Math
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Answer as many problems as you can before the timer
              runs out.
            </p>
          </div>
        </div>

        <SpeedMathGame />
      </div>
    </DashboardLayout>
  );
}
