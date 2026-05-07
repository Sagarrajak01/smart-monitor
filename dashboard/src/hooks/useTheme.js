import { useEffect, useState } from 'react';

export const useTheme = (initialDark = false) => {
  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
  }, [dark]);

  return [dark, setDark];
};