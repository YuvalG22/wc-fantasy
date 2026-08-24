import { put } from "@vercel/blob";

const USERS = [
  2827, 2850, 3053, 3123, 3217, 3222, 3605, 3771, 3818, 4467, 8018, 11994,
  13006, 17213, 17335, 19509, 19730, 30205, 36407, 59873, 84349,
];

const SEASON_ID = 10;

const SPORT5_COOKIE = process.env.SPORT5_COOKIE;

async function fetchLeagueData() {
  const res = await fetch(
    `https://dreamteam.sport5.co.il/api/Leagues/Get?seasonId=${SEASON_ID}`,
    {
      headers: {
        accept: "application/json",
        cookie: SPORT5_COOKIE,
        "user-agent": "Mozilla/5.0",
      },
    },
  );

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`League: ${res.status} ${text.slice(0, 200)}`);
  }

  if (!res.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Sport5 league endpoint did not return JSON");
  }

  return JSON.parse(text);
}

async function fetchUserTeam(userId) {
  const url =
    `https://dreamteam.sport5.co.il/api/UserTeam/GetUserAndTeam` +
    `?seasonId=${SEASON_ID}&userId=${userId}`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      cookie: SPORT5_COOKIE,
      "user-agent": "Mozilla/5.0",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`User ${userId}: ${response.status} ${text.slice(0, 200)}`);
  }

  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(`User ${userId}: Sport5 did not return JSON`);
  }

  return JSON.parse(text);
}

function simplifyResponse(apiResponse) {
  const team = apiResponse.data.userTeam;

  return {
    userId: team.userId,
    teamId: team.id,
    teamName: team.name,
    creatorName: team.creatorName,
    seasonId: team.seasonId,
    roundId: team.roundId,
    points: team.points,
    usedBudget: team.usedBudget,

    captainId: team.captainId,
    subCaptainId: team.subCaptainId,

    bonusesData: (team.bonusesData ?? []).map((bonus) => ({
      bonusId: bonus.bonusId,
      usageRoundId: bonus.usageRoundId,
      usageDate: bonus.usageDate,
    })),

    roundPoints: (team.userTeamRoundPoints ?? []).map((round) => ({
      roundId: round.roundId,
      points: round.points,
      seasonPoints: round.seasonPoints,
    })),

    players: (team.userTeamPlayers ?? []).map((item) => ({
      id: item.player.id,
      name: item.player.name.trim(),
      teamId: item.player.teamId,
      teamName: item.player.teamName,
      position: item.player.position,
      price: item.player.price,
      boughtPrice: item.boughtPrice,
      isReserve: item.isReserve,
      isActive: item.isActive,
      isRemoved: item.isRemoved,
      addedRoundId: item.addedRoundId,

      lastRound: {
        roundId: item.player.lastRoundPlayerStats?.roundId ?? null,
        points: item.player.lastRoundPlayerStats?.points ?? 0,
        seasonPoints: item.player.lastRoundPlayerStats?.seasonPoints ?? 0,
      },

      season: {
        points: item.player.lastSeasonPlayerStats?.points ?? 0,
      },
    })),
  };
}

export default async function handler(req, res) {
  try {
    if (!SPORT5_COOKIE) {
      return res.status(500).json({
        success: false,
        error: "SPORT5_COOKIE is missing",
      });
    }

    console.log("Starting fantasy update...");

    const leagueData = await fetchLeagueData();

    const games = (leagueData.data.games ?? []).map((game) => ({
      id: game.id,
      roundId: game.roundId,
      teamAId: game.teamAId,
      teamBId: game.teamBId,
      teamAName: game.teamAName,
      teamBName: game.teamBName,
      gameStatus: game.gameStatus,
      gameStart: game.gameStart,
      gameEnd: game.gameEnd,
    }));

    const teams = [];

    for (const userId of USERS) {
      console.log(`Fetching user ${userId}...`);

      const apiResponse = await fetchUserTeam(userId);
      const simplified = simplifyResponse(apiResponse);

      teams.push(simplified);
    }

    const output = {
      updatedAt: new Date().toISOString(),
      seasonId: SEASON_ID,
      games,
      teams,
    };

    const blob = await put(
      "fantasy-data.json",
      JSON.stringify(output, null, 2),
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      },
    );

    console.log("Fantasy data updated:", blob.url);

    return res.status(200).json({
      success: true,
      updatedAt: output.updatedAt,
      teams: teams.length,
      games: games.length,
      url: blob.url,
    });
  } catch (error) {
    console.error("Fantasy update failed:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
