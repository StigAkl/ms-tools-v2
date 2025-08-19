import { User } from "@/models/types";
import { ExternalLinkIcon } from "lucide-react";

interface RankSectionProps {
  rank: string;
  ranks: User[];
}

const RankSection = ({ rank, ranks }: RankSectionProps) => {
  return (
    <div className="rounded-lg bg-card text-slate-400 flex-1">
      <p className="font-bold p-3 text-primary text-center"> {rank} ({ranks.length})</p>
      <div className="mt-2 grid grid-cols-2">
        {ranks.map((rank, index) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://mafiaspillet.no/game.php?p=profil&bruker=${rank.name}`}
            key={rank.name}
            className={`
            px-4 
            hover:bg-secondary 
            hover:text-primary
            py-1 flex 
            items-center 
            justify-between
                          ${index % 2 === 0 ? 'border-r-2 border-primary' : ''}`}>
            {rank.name}
            <ExternalLinkIcon size={"14px"} />
          </a>
        ))}
      </div>
    </div>
  )
}
export default RankSection;