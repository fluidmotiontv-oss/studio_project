import { useState, useEffect, useRef } from 'react';
import { dragon9Time } from '../services/Dragon9Time.js';
import { eventBus, EVENTS } from '../services/EventBus.js';

export function useDragon9Clock() {
  const [time, setTime] = useState(() => dragon9Time.fromStandardDate());
  const prevTimeRef = useRef(time);

  useEffect(() => {
    const update = () => {
      const d9 = dragon9Time.fromStandardDate();
      const prev = prevTimeRef.current;

      setTime(d9);

      eventBus.emit(EVENTS.D9_TICK, d9);

      if (d9.isApex && !prev.isApex) {
        eventBus.emit(EVENTS.D9_APEX_ENTER, d9);
      }

      if (!d9.isApex && prev.isApex) {
        eventBus.emit(EVENTS.D9_APEX_EXIT, d9);
      }

      if (d9.cycle !== prev.cycle) {
        eventBus.emit(EVENTS.D9_CYCLE_CHANGE, d9);
      }

      prevTimeRef.current = d9;
    };

    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const display = dragon9Time.formatDisplay(time);
  const nextApex = dragon9Time.getNextApex(time.standardTime);

  return { time, display, nextApex };
}
