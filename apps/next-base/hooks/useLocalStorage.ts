'use client';

import { useEffect, useState } from 'react';

export const useLocalStorage = () => {
  const [localStorage, setLocalStorage] = useState<unknown>(null);
  useEffect(() => {
    setLocalStorage((window as any)?.localStorage);
  }, []);
  return localStorage;
};
