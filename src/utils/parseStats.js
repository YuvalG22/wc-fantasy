// src/utils/parseStats.js
export function parseStatsData(statsData) {
  if (!statsData) return {};

  try {
    return JSON.parse(statsData);
  } catch {
    return {};
  }
}