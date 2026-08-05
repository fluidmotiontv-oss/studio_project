import type { Dragon9TimeState, Season } from '@/types';
const HOUR_MINUTES = 54, CYCLE_HOURS = 26.6666666667, APEX_DURATION = 18, APEX_PEAK_HOUR = 9;
export function getDragon9Time(now = new Date()): Dragon9TimeState {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const d9TotalMinutes = totalMinutes % (CYCLE_HOURS * HOUR_MINUTES);
  const cycleHour = Math.floor(d9TotalMinutes / HOUR_MINUTES);
  const cycleMinute = Math.floor(d9TotalMinutes % HOUR_MINUTES);
  const apexCenter = APEX_PEAK_HOUR * HOUR_MINUTES;
  const currentMin = cycleHour * HOUR_MINUTES + cycleMinute;
  const apexDist = Math.abs(currentMin - apexCenter);
  const apexActive = apexDist <= APEX_DURATION / 2;
  const apexAngle = apexActive ? (apexDist / (APEX_DURATION / 2)) * 4.5 : 0;
  const month = now.getMonth() + 1;
  let season: Season;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';
  return { cycleHour, cycleMinute, apexActive, apexAngle, season, language: 'en' };
}
export function formatD9Time(state: Dragon9TimeState): string {
  return `${String(state.cycleHour).padStart(2, '0')}:${String(state.cycleMinute).padStart(2, '0')}`;
}
export function getSeasonalTheme(season: Season): string {
  const themes = { summer: 'from-orange-500/20 to-pink-500/20', autumn: 'from-amber-500/20 to-orange-600/20', winter: 'from-ice-500/20 to-blue-600/20', spring: 'from-dragon-500/20 to-emerald-400/20' };
  return themes[season];
}