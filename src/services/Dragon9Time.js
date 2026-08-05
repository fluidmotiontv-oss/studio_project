/**
 * Dragon 9 Time Framework
 * Reallocates 1,440 minutes into two 13-hour cycles (54-min hours).
 * 18-minute Apexes anchored symmetrically around Midday & Midnight.
 * 13th Hour acts as an open transition space leading directly into the Apex.
 */

export class Dragon9Time {
  constructor() {
    this.DRAGON_HOUR_MINUTES = 54;
    this.CYCLE_HOURS = 13;
    this.APEX_MINUTES = 18;
    this.TOTAL_STANDARD_MINUTES = 1440;
  }

  fromStandardDate(date = new Date()) {
    const d = date instanceof Date ? date : new Date(date);
    const minutesSinceMidnight = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;

    let cycle = 1;
    let isApex = false;
    let apexProgress = 0;
    let cycleMinutes = 0;
    let dragonHour = 0;
    let isTransitionSpace = false;

    // Symmetrical Apex Windows (18 mins total: -9m to +9m around 12:00)
    if (minutesSinceMidnight >= 711 && minutesSinceMidnight < 729) {
      // MIDDAY APEX
      cycle = 1;
      isApex = true;
      apexProgress = (minutesSinceMidnight - 711) / this.APEX_MINUTES;
    } else if (minutesSinceMidnight >= 1431 || minutesSinceMidnight < 9) {
      // MIDNIGHT APEX
      cycle = 2;
      isApex = true;
      const m = minutesSinceMidnight >= 1431 ? minutesSinceMidnight - 1431 : minutesSinceMidnight + 9;
      apexProgress = m / this.APEX_MINUTES;
    } else if (minutesSinceMidnight >= 9 && minutesSinceMidnight < 711) {
      // CYCLE 1 (00:09 AM - 11:51 AM = 702 mins)
      cycle = 1;
      cycleMinutes = minutesSinceMidnight - 9;
    } else {
      // CYCLE 2 (12:09 PM - 11:51 PM = 702 mins)
      cycle = 2;
      cycleMinutes = minutesSinceMidnight - 729;
    }

    if (!isApex) {
      dragonHour = Math.floor(cycleMinutes / this.DRAGON_HOUR_MINUTES) + 1;
      if (dragonHour === 13) {
        isTransitionSpace = true;
      }
    }

    const remainingMinutes = cycleMinutes % this.DRAGON_HOUR_MINUTES;
    const dragonMinute = Math.floor(remainingMinutes);
    const dragonSecond = Math.floor((remainingMinutes - dragonMinute) * 60);

    return {
      dragonHour: isTransitionSpace ? 'TRANSITION' : dragonHour,
      dragonMinute,
      dragonSecond,
      cycle,
      isApex,
      isTransitionSpace,
      apexProgress,
      standardTime: d,
      formatted: isApex 
        ? 'APEX WEDGE' 
        : (isTransitionSpace 
            ? `OPEN WEDGE:${String(dragonMinute).padStart(2, '0')}:${String(dragonSecond).padStart(2, '0')}`
            : `H${String(dragonHour).padStart(2, '0')}:${String(dragonMinute).padStart(2, '0')}:${String(dragonSecond).padStart(2, '0')}`)
    };
  }

  formatDisplay(d9Time) {
    if (!d9Time) return { main: '00:00:00', sub: '', detail: '', color: '#00f5ff' };
    if (d9Time.isApex) {
      return {
        main: 'APEX WEDGE',
        sub: `${Math.floor(d9Time.apexProgress * 100)}% — ${d9Time.cycle === 1 ? 'Midday' : 'Midnight'} Synchronisation`,
        detail: '18-Minute Peak Anchor',
        color: '#ffd93d',
      };
    }
    return {
      main: d9Time.formatted || '00:00:00',
      sub: d9Time.isTransitionSpace 
        ? `Cycle ${d9Time.cycle} — Open Transition Space` 
        : `Cycle ${d9Time.cycle} — Hour ${d9Time.dragonHour}/13`,
      detail: `54m Pace`,
      color: d9Time.isTransitionSpace ? '#ff007f' : '#00f5ff',
    };
  }

  getNextApex(date = new Date()) {
    const d = date instanceof Date ? date : new Date(date);
    const nowMs = d.getTime();
    
    // Target 11:51 AM or 11:51 PM anchors
    const middayTarget = new Date(d).setHours(11, 51, 0, 0);
    const midnightTarget = new Date(d).setHours(23, 51, 0, 0);
    
    let target = middayTarget;
    let label = "Midday Apex";
    
    if (nowMs >= middayTarget && nowMs < midnightTarget) {
      target = midnightTarget;
      label = "Midnight Apex";
    } else if (nowMs >= midnightTarget) {
      const tomorrow = new Date(d);
      tomorrow.setDate(tomorrow.getDate() + 1);
      target = tomorrow.setHours(11, 51, 0, 0);
      label = "Midday Apex";
    }

    const diffMs = Math.max(0, target - nowMs);
    const minutesRemaining = Math.floor(diffMs / 60000);
    const secondsRemaining = Math.floor((diffMs % 60000) / 1000);

    return {
      label,
      time: "11:51",
      minutesRemaining,
      secondsRemaining,
      formattedCountdown: `${minutesRemaining}m ${secondsRemaining}s`,
      nextApexDate: new Date(target)
    };
  }
}

export const dragon9Time = new Dragon9Time();

export const STATIONS = [
  { id: '1', name: 'Fluid Motion Main Hub', frequency: '90.0 MHz' }
];
