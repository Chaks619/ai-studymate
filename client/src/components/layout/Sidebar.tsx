import { BookOpen } from "lucide-react";
import { Logo } from "./Logo";

export function Sidebar() {
  return (
    <aside className="w-72 border-r">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="space-y-2 px-3">
        <button
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-lg
            px-4
            py-3
            hover:bg-muted
          "
        >
          <BookOpen className="h-5 w-5"/>

          Workspaces
        </button>
      </nav>
    </aside>
  );
}