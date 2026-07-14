import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-6">
      <Breadcrumbs />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
