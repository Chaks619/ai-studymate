import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { TicTacToeGame } from "../components/TicTacToeGame";

export function TicTacToePage() {
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
              Tic-Tac-Toe
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Get three in a row before the AI does.
            </p>
          </div>
        </div>

        <TicTacToeGame />
      </div>
    </DashboardLayout>
  );
}
