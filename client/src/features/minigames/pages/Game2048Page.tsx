import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { Game2048 } from "../components/Game2048";

export function Game2048Page() {
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
              2048
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Slide the tiles and merge matching numbers to reach
              2048.
            </p>
          </div>
        </div>

        <Game2048 />
      </div>
    </DashboardLayout>
  );
}
