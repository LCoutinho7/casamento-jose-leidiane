import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function compute(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    finished: false,
  };
}

/** Contagem regressiva até `target`, atualizada a cada segundo. */
export function useCountdown(target: Date): Countdown {
  const [value, setValue] = useState(() => compute(target));

  useEffect(() => {
    const id = window.setInterval(() => setValue(compute(target)), SECOND);
    return () => window.clearInterval(id);
  }, [target]);

  return value;
}
