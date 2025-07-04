import { FileText, Mail, Move, Swords } from "lucide-react";
import { StatBadge } from "./StatBadge";

export function ActionIcons() {
  return (
    <div className="absolute top-4 right-4 hidden md:flex flex-col gap-3">
      <StatBadge Icon={Mail} count={5} />
      <StatBadge Icon={FileText} count={12} />
      <StatBadge Icon={Swords} count={2} />
      <StatBadge Icon={Move} count={1} />
    </div>
  );
}
