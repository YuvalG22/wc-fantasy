import fs from "fs/promises";

const USERS = [
  2827, 3053, 3123, 3217, 3222, 3605, 4467, 8018, 11994, 83871, 84349, 241490
];

const SEASON_ID = 9;
const SPORT5_COOKIE = `_cc_id=c46259bfc0b645555578159533c4a420; _ga=GA1.1.1999076977.1753334271; _ga_F4B6MNVH4V=GS2.1.s1753334270$o10$g1$t1753334304$j26$l0$h0; cto_bidid=XUfbNl9IcU9rZzgyejJITnhtaHI2QUFJeXFPZ3FaQThubm8zbzQlMkJaZFJ0VWMza01rYiUyRnRyWWRwVVZuRFZ0TTZqbmt6bTIlMkZsVkltUml5UmFNTHk4S0hWZnNtWWxhS1dCR3c4SjJtWjVEcmw5bUVWcyUzRA; AMCV_248F210755B762187F000101%40AdobeOrg=1176715910%7CMCIDTS%7C20371%7CMCMID%7C14763399833870470520681434756663203197%7CMCAAMLH-1760591449%7C6%7CMCAAMB-1760591449%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1759993849s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.4.0; __gads=ID=fc3db468fc47c6b6:T=1753334271:RT=1765452987:S=ALNI_MbAjNC-RBO7L3cenhoUsoHtueDuZA; __gpi=UID=00001226a38b4ef0:T=1753334271:RT=1765452987:S=ALNI_Mbg4j8SK2cCn7gRAbZIYOQEMUPddg; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22a63fcc1d-f52a-4219-9b8e-b67988fb5cd3%5C%22%2C%5B1761596481%2C932000000%5D%5D%22%5D%5D%5D; _pubcid=ed56969d-6f0a-4543-b533-26bddcf5d2c1; cto_bundle=Bt4_3l9wWldMa3BUY3NiSExlSXBwcFhQJTJCbnRjVFhtYnVybHh6U2FhRm5EJTJGRlhRJTJCeVo3SmdPRndRd1NZMjBXMGlDWDdCMmxhSmlNTUtVZFJyJTJCd2t4SnV6d0M2bG56JTJGNUR2ZGRzOHlDM2huWTdKM2trRHhUViUyQjJTMnVYJTJGRG1URE1sTHZSY1lZJTJCWVhvcmVTeWRZNkZqJTJGTFcxcnclM0QlM0Q; _ga_WQC32T9BHT=GS2.1.s1782361359$o5$g1$t1782361535$j60$l0$h0; __za_cd_19760733=%7B%22visits%22%3A%22%5B1782361330%2C1782275254%2C1782021606%2C1781413656%2C1777538803%2C1776577298%2C1776140804%5D%22%2C%22campaigns_status%22%3A%7B%2295945%22%3A1782364050%2C%2296250%22%3A1781413698%7D%7D; _clck=lsl7oo%5E2%5Eg7d%5E0%5E2295; minUnifiedSessionToken10=%7B%22sessionId%22%3A%22bb8a77cec3-e6438b82e6-c896697c91-574f67adc3-046b8ce724%22%2C%22uid%22%3A%221486df0325-c61ffcf689-717a5106c9-49d87c0d37-4bd973b3fe%22%2C%22__sidts__%22%3A1782894722974%2C%22__uidts__%22%3A1782894722974%7D; FCNEC=%5B%5B%22AKsRol9oGp2JKNp96MNjEEC2ogL7X4udQr2K0fNjrDHYr5c1ylzRl7Pcp0d6AHk9mucSDegsAQnrxKe-8l7yI9_58_LT4-Qq-ie1aZqX6xYgO4Hj5ID26kBFKumd2jd_NENGRVHpOyFlGxKWGRCgMwQaojh-BsBWKg%3D%3D%22%5D%5D; .AspNetCore.Cookies=CfDJ8JpmrYHpR1VGmuTLpKu48tTzY-arRGY8R0cPi7EaGy8D_gqdyjZ8Xjq7dmtKhmGWYhZb4xoqmVAaePtM7KypBrBoQAz0hVO2g3V6Ca3KgP3PD7lbvW84jKqH99DDCWG99z3YdklNAfMNDoLligNvkxN9dFFklAZ8z8e7dl7MgAesXlswhTsArSSgg3oNKpiX5MQqZ8Dv-FteO6t0jTwk6keu0KH-fFxjr4h8_ZEnvTAZD9vtPGNnxM47KSUSYAhJTWYbyBVfNv1my0HrCwHqulYF5p_YsaaJdhkqArdigbAhLu-tqyje2qfQIKrgv0yHU-Kkj2iAYhbJu-xMAANH6bapwaHRw0VPcpKlmR_yOacXPhHYX7Qxp1Xi-6sz5PFtdtwDDVC66Y6bNChXMeC1nMWoLrCjcjQoIBhsKW2mvzC7zmFs9jxIGAzKlBaSvRikSdFHYr2v3GWbZ-XFh-EWE_BCjYqg-lA0CLItt3x6U6tfX0RC3JQVoRGJRKH7cSwc0dJX4vbLi4FIT7Ltrg-uG6Y; utmParamsC={"utmTimestamp":1784521178575,"utmSource":"(direct)","utmMedium":"(none)","utmCampaign":"(not set)"}; _ga_4B37KQBXZ1=GS2.1.s1784521179$o52$g1$t1784521339$j58$l0$h0; _ga_2CB9C29485=GS2.1.s1784521179$o50$g1$t1784521339$j58$l0$h0`;

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
