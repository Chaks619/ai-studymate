import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end border-b px-6">
      <UserMenu />
    </header>
  );
}