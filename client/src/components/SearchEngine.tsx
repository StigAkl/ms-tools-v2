import { useEventsStore } from "@/stores/eventsStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Player } from "@/models/types";
import { useState } from "react";

const SearchEngine = () => {

  const [player, setPlayer] = useState<Player | undefined>(undefined)
  const [searchString, setSearchString] = useState<string>("");

  const players = useEventsStore(state => state.players);
  const playerNames = players.map(p => p.username);

  console.log(players);
  const searchByUsername = (username: string) => {
    const foundPlayer = players.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (foundPlayer) {
      setPlayer(foundPlayer);
    } else {
      setPlayer(undefined);
    }
  }

  return (
    <div className="flex justify-center flex-col gap-5">
      <Input value={searchString} onChange={(e) => setSearchString(e.target.value)} placeholder="Søk etter spiller.." />
      <Button onClick={() => searchByUsername(searchString)} className="w-24">Søk</Button>
      {player && <PlayerCard player={player} />}
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  if (!player) {
    return <div className="text-red-500">Ingen spiller funnet</div>;
  }

  const counts = player.hitBy.reduce<Record<string, number>>((acc, name) => {
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  const hitBy = Object.entries(counts)
    .map(([name, count]) => count > 1 ? `${name} (${count}x)` : name)
    .join(", ");

  const hitByMap = hitBy.split(", ").map(name => (
    <span key={name} className="text-blue-500">{name}, </span>
  ));

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold border-b py-2 mb-2">Søkeresultat</h2>
      <p className="text-lg font-semibold">Informasjon om {player.username}:</p>
      <p className="text-sm text-muted-foreground">Brukernavn: {player.username}</p>
      <p className="text-sm text-muted-foreground">Rank: {player.rank}</p>
      <p className="text-sm text-muted-foreground">Status: {player.dead ? "Død" : <span className="text-green-500">Levende</span>}</p>
      <p className="text-sm text-muted-foreground">Antall ganger truffet: {player.gottenHit}</p>
      <p className="text-sm text-muted-foreground">Antall treff på andre: {player.hits}</p>
      <hr />
      <p className="bg-muted mt-4 p-4 rounded-lg">
        Truffet av: {hitByMap.length > 0 ? hitByMap : "Ingen"}
      </p>
    </div>
  );
}

export default SearchEngine;