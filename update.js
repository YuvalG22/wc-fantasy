import fs from "fs/promises";

const USERS = [
  2827, 2850, 3053, 3123, 3217, 3222, 3605, 3771, 3818, 4467, 8018, 11994,
  13006, 17213, 17335, 19509, 19730, 30205, 36407, 59873, 84349,
];

const SEASON_ID = 10;
const SPORT5_COOKIE = `_cc_id=c46259bfc0b645555578159533c4a420; _ga=GA1.1.1999076977.1753334271; _ga_F4B6MNVH4V=GS2.1.s1753334270$o10$g1$t1753334304$j26$l0$h0; cto_bidid=XUfbNl9IcU9rZzgyejJITnhtaHI2QUFJeXFPZ3FaQThubm8zbzQlMkJaZFJ0VWMza01rYiUyRnRyWWRwVVZuRFZ0TTZqbmt6bTIlMkZsVkltUml5UmFNTHk4S0hWZnNtWWxhS1dCR3c4SjJtWjVEcmw5bUVWcyUzRA; AMCV_248F210755B762187F000101%40AdobeOrg=1176715910%7CMCIDTS%7C20371%7CMCMID%7C14763399833870470520681434756663203197%7CMCAAMLH-1760591449%7C6%7CMCAAMB-1760591449%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1759993849s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.4.0; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22a63fcc1d-f52a-4219-9b8e-b67988fb5cd3%5C%22%2C%5B1761596481%2C932000000%5D%5D%22%5D%5D%5D; _pubcid=ed56969d-6f0a-4543-b533-26bddcf5d2c1; cto_bundle=Bt4_3l9wWldMa3BUY3NiSExlSXBwcFhQJTJCbnRjVFhtYnVybHh6U2FhRm5EJTJGRlhRJTJCeVo3SmdPRndRd1NZMjBXMGlDWDdCMmxhSmlNTUtVZFJyJTJCd2t4SnV6d0M2bG56JTJGNUR2ZGRzOHlDM2huWTdKM2trRHhUViUyQjJTMnVYJTJGRG1URE1sTHZSY1lZJTJCWVhvcmVTeWRZNkZqJTJGTFcxcnclM0QlM0Q; _ga_WQC32T9BHT=GS2.1.s1782361359$o5$g1$t1782361535$j60$l0$h0; minUnifiedSessionToken10=%7B%22sessionId%22%3A%22af6a4fb65c-c2f0319d2a-2c3e0461f2-603b6c904d-32f6c7c639%22%2C%22uid%22%3A%225feb2b2e53-ca52358188-79dcf60e00-ad27e834d7-c356810f7b%22%2C%22__sidts__%22%3A1785830589899%2C%22__uidts__%22%3A1785830589899%7D; _clck=lsl7oo%5E2%5Eg8b%5E0%5E2295; FCNEC=%5B%5B%22AKsRol8QQ8EJpCirjJ7EBNpUYOiU7GTzJ9NroDsfAr8ozOodaBiWT5qFer7w_40pYabY-u2Z-lGvqU0uxAD1LoX-TM4-ALQRiJaCo6sYSaJC8o9PCaA-5o1U5-5ygWqEJsuS6u97B-kEG8cl0QXoeOuk18gFhCeycA%3D%3D%22%5D%5D; __za_cd_19760733=%7B%22visits%22%3A%22%5B1785830591%2C1782361330%2C1782275254%2C1782021606%2C1781413656%2C1777538803%2C1776577298%2C1776140804%5D%22%2C%22campaigns_status%22%3A%7B%2295945%22%3A1785830591%2C%2296250%22%3A1781413698%7D%7D; .AspNetCore.Cookies=CfDJ8JpmrYHpR1VGmuTLpKu48tSy_3CCD1JAVVcaKlo6v4rOhVX-AwODn4q3964ePC7yTVLaLa7KEeLsKcTWkSAPX49tw0bG59TCLAiw05PpdV2nyj7A_MtxCWpZdV-81UzDbwmRPJEfcbFV7OkE-2kJUBFAs_zyBo5EuhL29rUTtf_OwdnMkPPCMhhxcZPAnHShUml4kbqIvRUcehuLO3s_M1rOgPvBDiAFBrw6y5zKHKDPLdiTLd0yZ_r-p-QHcLZyu8GvD0nD-tuCnombpXfGI1z5GWKiGALwxNv3dlFXfgIx-01sOLG0XqPEr6rvReqwKLAnqJdYhI2araoCgTATUltpGINdMHYRrAL_svS2p9IXsH4D5m8odSL4HGEAnecpGjQRyLVIdcDX8enKxle2OherDJmtj4sW2VFe550S4q6lrGoTvTyLUHfWY5WHSF_VDjRHv0YZS4rj64fpezMrW9jqWDIifKs5fqxaty9CTPkJ2doX_e8o3bnOLNiYTlql5UTvTIlFOtoajnZGSpgmQwY; taboola_global_user_id=a5529b6a-e67a-4610-9392-933865b36cd9-tuctc8ab25f; utmParamsC={"utmTimestamp":1787574565063,"utmSource":"(direct)","utmMedium":"(none)","utmCampaign":"(not set)"}; g_state={"i_l":0,"i_ll":1787574565229,"i_e":{"enable_itp_optimization":24},"i_et":1787574565229,"i_b":"5AUK3DNb87Oza+pBgatV7qtFPZ02RS+s9cepw72w1WU"}; _ga_2CB9C29485=GS2.1.s1787574566$o53$g1$t1787574580$j46$l0$h0; _ga_4B37KQBXZ1=GS2.1.s1787574566$o56$g1$t1787574580$j46$l0$h0`
if (!SPORT5_COOKIE) {
  console.error("Missing SPORT5_COOKIE env variable");
  process.exit(1);
}

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

  const data = await res.json();
  return data;
}

async function fetchUserTeam(userId) {
  const url = `https://dreamteam.sport5.co.il/api/UserTeam/GetUserAndTeam?seasonId=${SEASON_ID}&userId=${userId}`;

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

async function main() {
  const leagueData = await fetchLeagueData();

  const games = leagueData.data.games.map((game) => ({
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

  const result = [];

  for (const userId of USERS) {
    console.log(`Fetching user ${userId}...`);

    const apiResponse = await fetchUserTeam(userId);
    const simplified = simplifyResponse(apiResponse);

    result.push(simplified);
  }

  const output = {
    updatedAt: new Date().toISOString(),
    seasonId: SEASON_ID,
    games,
    teams: result,
  };

  await fs.mkdir("public/data", { recursive: true });

  await fs.writeFile(
    "public/data/fantasy-data.json",
    JSON.stringify(output, null, 2),
    "utf-8",
  );

  console.log("Saved public/data/fantasy-data.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
