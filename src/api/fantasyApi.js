// src/api/fantasyApi.js
export async function getUserTeam(userId) {
  const res = await fetch(`/api/user-team/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user team");
  }

  return res.json();
}