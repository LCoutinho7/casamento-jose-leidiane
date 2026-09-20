import { useEffect, useState } from 'react';

/** Estado sincronizado com o localStorage; cai no valor inicial se o storage falhar. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage indisponível (modo privado, cota cheia): segue só em memória
    }
  }, [key, value]);

  return [value, setValue] as const;
}
