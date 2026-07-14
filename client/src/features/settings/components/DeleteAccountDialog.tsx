import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/auth.slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteAccountMutation } from "@/services/api/user.api";

const CONFIRM_PHRASE = "DELETE";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const canDelete =
    password.length > 0 && confirmation === CONFIRM_PHRASE && !isLoading;

  async function handleDelete() {
    try {
      await deleteAccount({ password }).unwrap();

      // The user no longer exists, so there is nobody to call /auth/logout
      // as — just drop the session locally.
      dispatch(logout());

      toast.success("Your account has been deleted");

      navigate("/login");
    } catch {
      toast.error("Couldn't delete your account. Check your password.");
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      setPassword("");
      setConfirmation("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant="destructive">Delete account</Button>}
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlert className="size-5 text-destructive" />
            Delete your account
          </DialogTitle>

          <DialogDescription>
            This permanently removes your workspaces, documents, and every
            summary, flashcard deck and quiz generated from them. It cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Confirm your password</Label>

            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Type <span className="font-mono font-semibold">{CONFIRM_PHRASE}</span>{" "}
              to confirm
            </Label>

            <Input
              id="delete-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!canDelete}
            onClick={handleDelete}
          >
            {isLoading ? "Deleting…" : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
