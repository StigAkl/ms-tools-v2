import RankSection from "@/components/RankSection";
import { User, RankStatistics } from "@/models/types";
import { useEffect, useState } from "react";

const UserRanks = () => {
  const [ranks, setRanks] = useState<RankStatistics>();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/ranks').then(data => {
      data.json().then(result => {
        const ranks: User[] = result.ranks;
        const gudfar = ranks.filter(r => r.rank === 'gudfar');
        const capoCrimini = ranks.filter(r => r.rank === 'capo crimini');
        const tutti = ranks.filter(r => r.rank === 'capo de tutti capi');
        ''
        setRanks({
          gudfar: gudfar.sort((a, b) => a.name > b.name ? 1 : -1),
          capoCrimini: capoCrimini.sort((a, b) => a.name > b.name ? 1 : -1),
          tutti: tutti.sort((a, b) => a.name > b.name ? 1 : -1)
        })
      });
    })
  }, []);

  return (
    <>
      <section>
        {ranks && (
          <div className="h-full w-full flex flex-wrap justify-center p-2 gap-10">
            <RankSection rank='Gudfar' ranks={ranks.gudfar} />
            <RankSection rank='Capo Crimini' ranks={ranks.capoCrimini} />
            <RankSection rank='Capo de tutti Capi' ranks={ranks.tutti} />
          </div>
        )}
      </section>
    </>
  )
}

export default UserRanks;