import { useEffect, useState } from "react";
import { getUserTeam } from "./api/fantasyApi";

async function getAllTeamsFromJson() {
  const res = await fetch("/data/fantasy-data.json");

  if (!res.ok) {
    throw new Error("Failed to load local fantasy data");
  }

  return res.json();
}

function getCaptainMultiplier(playerId, team, selectedRoundId) {
  const hasTripleCaptain = team.bonusesData?.some(
    (bonus) => bonus.bonusId === 1 && bonus.usageRoundId === selectedRoundId,
  );

  const hasDoubleCaptains = team.bonusesData?.some(
    (bonus) => bonus.bonusId === 3 && bonus.usageRoundId === selectedRoundId,
  );

  if (playerId === team.captainId) {
    return hasTripleCaptain ? "X3" : "X2";
  }

  if (hasDoubleCaptains && playerId === team.subCaptainId) {
    return "X2";
  }

  return "";
}

const USERS = [
  { userId: 2827, name: "מ.ס. כפר ויתקין" },
  { userId: 3053, name: "מוצאצוס" },
  { userId: 3123, name: "הבנים של אודי" },
  { userId: 3217, name: "11 טילי מצרר" },
  { userId: 3222, name: "יונאיהיטי" },
  { userId: 3605, name: "ARG" },
  { userId: 4467, name: "Pass pass it's a come" },
  { userId: 8018, name: "בנצי" },
  { userId: 11994, name: "Halsh meod" },
  { userId: 83871, name: "פלחלחים" },
  { userId: 84349, name: "יובל גנון" },
  { userId: 241490, name: "Malma win" },
];

function App() {
  const [rows, setRows] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState(null);

  useEffect(() => {
    async function loadAllTeams() {
      try {
        setLoading(true);

        const jsonData = await getAllTeamsFromJson();
        const responses = jsonData.map((item) => item.response);

        setTeamsData(responses);

        const mappedRows = responses.flatMap((response) => {
          const team = response.data.userTeam;

          return team.userTeamRoundPoints.map((round) => ({
            userId: team.userId,
            teamName: team.name,
            creatorName: team.creatorName,
            roundId: round.roundId,
            points: round.points,
            seasonPoints: round.seasonPoints,
          }));
        });

        setRows(mappedRows);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    }

    loadAllTeams();
  }, []);

  const rounds = [...new Set(rows.map((row) => row.roundId))]
    .sort((a, b) => a - b)
    .slice(0, 8);

  const activeRoundId = selectedRoundId ?? rounds.at(-1);
  const activeRoundRows = activeRoundId ? getRoundTable(activeRoundId) : [];

  const roundMap = Object.fromEntries(
    rounds.map((roundId, index) => [roundId, index + 1]),
  );

  const generalTable = USERS.map((user) => {
    const userRows = rows
      .filter((row) => row.userId === user.userId)
      .sort((a, b) => a.roundId - b.roundId);

    const base = {
      userId: user.userId,
      teamName: userRows[0]?.teamName ?? user.name,
      creatorName: userRows[0]?.creatorName ?? "",
      total: userRows.at(-1)?.seasonPoints ?? 0,
    };

    rounds.forEach((roundId) => {
      const round = userRows.find((row) => row.roundId === roundId);
      base[`round_${roundId}`] = round?.points ?? 0;
    });

    return base;
  }).sort((a, b) => b.total - a.total);

  function getRoundTable(roundId) {
    return rows
      .filter((row) => row.roundId === roundId)
      .sort((a, b) => b.points - a.points);
  }

  const latestRoundId = rounds.at(-1);

  const improvementTable = (() => {
    if (!latestRoundId) return [];

    const latestRows = rows.filter((row) => row.roundId === latestRoundId);

    const previousRanking = [...latestRows]
      .map((row) => ({
        ...row,
        previousTotal: row.seasonPoints - row.points,
      }))
      .sort((a, b) => b.previousTotal - a.previousTotal)
      .map((row, index) => ({
        ...row,
        previousRank: index + 1,
      }));

    const currentRanking = [...latestRows]
      .sort((a, b) => b.seasonPoints - a.seasonPoints)
      .map((row, index) => ({
        ...row,
        currentRank: index + 1,
      }));

    return currentRanking
      .map((current) => {
        const previous = previousRanking.find(
          (row) => row.userId === current.userId,
        );

        const change = previous.previousRank - current.currentRank;

        return {
          ...current,
          previousRank: previous.previousRank,
          currentRank: current.currentRank,
          change,
        };
      })
      .sort((a, b) => b.change - a.change);
  })();

  const bestRoundPlayers = teamsData
    .flatMap((response) =>
      response.data.userTeam.userTeamPlayers
        .filter((p) => !p.isRemoved)
        .map((p) => {
          const lastStats = p.player.lastRoundPlayerStats;

          return {
            id: p.player.id,
            name: p.player.name,
            points: lastStats?.roundId === latestRoundId ? lastStats.points : 0,
            statsRoundId: lastStats?.roundId,
          };
        }),
    )
    .filter(
      (player, index, self) =>
        index === self.findIndex((p) => p.id === player.id),
    )
    .sort((a, b) => b.points - a.points);

  const groupedPlayers = Object.entries(
    bestRoundPlayers
      .filter((player) => player.points > 0)
      .reduce((acc, player) => {
        if (!acc[player.points]) {
          acc[player.points] = [];
        }

        acc[player.points].push(player.name);
        return acc;
      }, {}),
  )
    .map(([points, names]) => ({
      points: Number(points),
      names,
    }))
    .sort((a, b) => b.points - a.points);

  const ownershipTable = Object.values(
    teamsData.reduce((acc, response) => {
      const team = response.data.userTeam;

      team.userTeamPlayers
        .filter((p) => !p.isRemoved)
        .forEach((p) => {
          const playerId = p.player.id;

          const lastStats = p.player.lastRoundPlayerStats;

          const points =
            lastStats?.roundId === latestRoundId ? lastStats.points : 0;

          if (!acc[playerId]) {
            acc[playerId] = {
              id: playerId,
              name: p.player.name,
              count: 0,
              teams: [],
              points,
              statsRoundId: lastStats?.roundId,
            };
          }

          acc[playerId].count++;
          acc[playerId].teams.push(team.name);
        });

      return acc;
    }, {}),
  );

  const uniquePlayers = ownershipTable.filter((player) => player.count === 1);

  const uniquePlayersByTeam = USERS.map((user) => {
    const teamResponse = teamsData.find(
      (response) => response.data.userTeam.userId === user.userId,
    );

    const teamName = teamResponse?.data.userTeam.name ?? user.name;

    const players = uniquePlayers.filter((player) =>
      player.teams.includes(teamName),
    );

    return {
      userId: user.userId,
      teamName,
      players,
      count: players.length,
    };
  }).sort((a, b) => b.count - a.count);

  const popularPlayers = [...ownershipTable].sort((a, b) => b.count - a.count);

  const differentialScorers = ownershipTable
    .filter((player) => player.count === 1 && player.points > 2)
    .sort((a, b) => b.points - a.points);

  const remainingPlayersByTeam = teamsData
    .map((response) => {
      const team = response.data.userTeam;

      const hasFullSquadBonus = team.bonusesData?.some(
        (bonus) =>
          bonus.bonusId === 4 && bonus.usageRoundId === latestRoundId,
      );

      const remainingPlayers = team.userTeamPlayers
        .filter((p) => !p.isRemoved)
        .filter((p) => hasFullSquadBonus || !p.isReserve)
        .filter((p) => {
          const statsRoundId = p.player.lastRoundPlayerStats?.roundId;
          return statsRoundId !== latestRoundId;
        })
        .map((p) => ({
          id: p.player.id,
          name: p.player.name,
          position: p.player.position,
          isReserve: p.isReserve,
          multiplier: getCaptainMultiplier(p.player.id, team, latestRoundId),
        }));

      return {
        userId: team.userId,
        teamName: team.name,
        creatorName: team.creatorName,
        hasFullSquadBonus,
        count: remainingPlayers.length,
        players: remainingPlayers,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-md px-2 py-3">
        <header className="mb-4 rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-700 p-4 text-center shadow-xl">
          <p className="mb-1 text-xs font-medium text-blue-100">
            World Cup Fantasy
          </p>
          <h1 className="text-2xl font-black">Fantasy Dashboard</h1>
        </header>

        {loading && (
          <div className="rounded-xl bg-slate-900 p-5 text-center text-sm shadow-lg">
            טוען נתונים...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500 bg-red-950 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-black">🏆 דירוג כללי</h2>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                  {generalTable.length} קבוצות
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-[11px]">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[11%] px-1 py-2 text-center">#</th>
                      <th className="w-[38%] px-1 py-2 text-right">קבוצה</th>

                      {rounds.map((roundId) => (
                        <th key={roundId} className="px-1 py-2 text-center">
                          {roundMap[roundId]}
                        </th>
                      ))}

                      <th className="w-[14%] px-1 py-2 text-center">סה״כ</th>
                    </tr>
                  </thead>

                  <tbody>
                    {generalTable.map((team, index) => (
                      <tr
                        key={team.userId}
                        className="border-t border-slate-800"
                      >
                        <td
                          className={`px-1 py-1 text-center font-semibold" ${index < 3 ? "text-lg" : ""}`}
                        >
                          {index === 0
                            ? "🥇"
                            : index === 1
                              ? "🥈"
                              : index === 2
                                ? "🥉"
                                : index + 1}
                        </td>
                        <td className="truncate px-1 py-1 font-semibold">
                          {team.teamName}
                        </td>

                        {rounds.map((roundId) => (
                          <td key={roundId} className="px-1 py-1 text-center">
                            {team[`round_${roundId}`]}
                          </td>
                        ))}

                        <td className="px-1 py-1 text-center font-bold text-blue-300">
                          {team.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">📊 ניקוד לפי מחזור</h2>

              <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
                {rounds.map((roundId) => (
                  <button
                    key={roundId}
                    onClick={() => setSelectedRoundId(roundId)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      activeRoundId === roundId
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    מחזור {roundMap[roundId]}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[12%] px-1 py-2 text-center">#</th>
                      <th className="w-[42%] px-2 py-2 text-right">קבוצה</th>
                      <th className="px-1 py-2 text-center">נק׳</th>
                      <th className="px-1 py-2 text-center">מצטבר</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeRoundRows.map((row, index) => (
                      <tr
                        key={`${row.userId}-${row.roundId}`}
                        className="border-t border-slate-800"
                      >
                        <td className="px-1 py-1 text-center font-semibold">
                          {index + 1}
                        </td>

                        <td className="truncate px-2 py-1 font-semibold">
                          {row.teamName}
                        </td>

                        <td className="px-1 py-1 text-center font-bold text-emerald-300">
                          {row.points}
                        </td>

                        <td className="px-1 py-1 text-center font-bold text-amber-300">
                          {row.seasonPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">🔥 טופ שחקנים במחזור</h2>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs">
                {groupedPlayers.slice(0, 5).map((group, index) => (
                  <div
                    key={group.points}
                    className="flex items-center justify-between gap-2 border-b border-slate-800 py-2 last:border-b-0"
                  >
                    <span className="truncate">
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : ""}{" "}
                      {group.names.join(", ")}
                    </span>

                    <span className="shrink-0 font-semibold text-emerald-300">
                      {group.points} נק׳
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-black">📈 שינוי בדירוג</h2>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                  מחזור {roundMap[latestRoundId]}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[46%] px-2 py-2 text-right">קבוצה</th>
                      <th className="px-1 py-2 text-center">לפני</th>
                      <th className="px-1 py-2 text-center">עכשיו</th>
                      <th className="px-1 py-2 text-center">שינוי</th>
                    </tr>
                  </thead>

                  <tbody>
                    {improvementTable.map((team) => (
                      <tr
                        key={team.userId}
                        className="border-t border-slate-800"
                      >
                        <td className="truncate px-2 py-1 font-semibold">
                          {team.teamName}
                        </td>

                        <td className="px-1 py-1 text-center text-slate-300">
                          {team.previousRank}
                        </td>

                        <td className="px-1 py-1 text-center font-semibold">
                          {team.currentRank}
                        </td>

                        <td
                          className={`px-1 py-1 text-center font-semibold ${
                            team.change > 0
                              ? "text-emerald-300"
                              : team.change < 0
                                ? "text-red-300"
                                : "text-slate-400"
                          }`}
                        >
                          {team.change > 0
                            ? `+${team.change}`
                            : team.change < 0
                              ? team.change
                              : "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">
                💎 שחקנים ייחודיים לפי קבוצה
              </h2>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-[11px]">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[36%] px-2 py-2 text-right">קבוצה</th>
                      <th className="w-[14%] px-1 py-2 text-center">כמות</th>
                      <th className="px-2 py-2 text-right">שחקנים</th>
                    </tr>
                  </thead>

                  <tbody>
                    {uniquePlayersByTeam.map((team) => (
                      <tr
                        key={team.userId}
                        className="border-t border-slate-800"
                      >
                        <td className="truncate px-2 py-1 font-semibold">
                          {team.teamName}
                        </td>

                        <td className="px-1 py-1 text-center font-semibold text-blue-300">
                          {team.count}
                        </td>

                        <td className="px-2 py-1 text-slate-300">
                          {team.players.length > 0
                            ? team.players.map((p) => p.name).join(", ")
                            : "אין"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">🔥 אחוזי בחירה</h2>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[42%] px-2 py-2 text-right">שחקן</th>
                      <th className="px-1 py-2 text-center">נבחר</th>
                      <th className="px-1 py-2 text-center">אחוז</th>
                      <th className="px-1 py-2 text-center">נק׳</th>
                    </tr>
                  </thead>

                  <tbody>
                    {popularPlayers.map((player) => (
                      <tr key={player.id} className="border-t border-slate-800">
                        <td className="truncate px-2 py-1 font-semibold">
                          {player.name}
                        </td>

                        <td className="px-1 py-1 text-center">
                          {player.count}/{USERS.length}
                        </td>

                        <td className="px-1 py-1 text-center font-semibold text-emerald-300">
                          {Math.round((player.count / USERS.length) * 100)}%
                        </td>

                        <td className="px-1 py-1 text-center font-semibold text-amber-300">
                          {player.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">
                💎 ייחודיים שעשו נקודות
              </h2>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-xs">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[38%] px-2 py-2 text-right">שחקן</th>
                      <th className="w-[15%] px-1 py-2 text-center">נק׳</th>
                      <th className="w-[18%] px-1 py-2 text-center">נבחר</th>
                      <th className="px-2 py-2 text-right">קבוצות</th>
                    </tr>
                  </thead>

                  <tbody>
                    {differentialScorers.map((player) => (
                      <tr key={player.id} className="border-t border-slate-800">
                        <td className="truncate px-2 py-1 font-semibold">
                          {player.name}
                        </td>

                        <td className="px-1 py-1 text-center font-semibold text-emerald-300">
                          {player.points}
                        </td>

                        <td className="px-1 py-1 text-center font-semibold text-blue-300">
                          {player.count}/{USERS.length}
                        </td>

                        <td className="px-2 py-1 text-slate-300">
                          {player.teams.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-lg font-black">
                ⏳ שחקנים שעוד לא שיחקו
              </h2>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full table-fixed border-collapse text-[11px]">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="w-[34%] px-2 py-2 text-right">קבוצה</th>
                      <th className="w-[14%] px-1 py-2 text-center">נשארו</th>
                      <th className="px-2 py-2 text-right">שחקנים</th>
                    </tr>
                  </thead>

                  <tbody>
                    {remainingPlayersByTeam.map((team) => (
                      <tr
                        key={team.userId}
                        className="border-t border-slate-800"
                      >
                        <td className="truncate px-2 py-1 font-semibold">
                          {team.teamName}
                        </td>

                        <td className="px-1 py-1 text-center text-xs font-semibold text-amber-300">
                          {team.count}
                        </td>

                        <td className="px-2 py-1 text-slate-300">
                          {team.players.length > 0
                            ? team.players
                                .map(
                                  (p) =>
                                    `${p.name}${p.multiplier ? ` (${p.multiplier})` : ""}`,
                                )
                                .join(", ")
                            : "אין"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
