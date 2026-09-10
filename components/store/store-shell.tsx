import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return <><StoreHeader />{children}<StoreFooter /></>;
}
