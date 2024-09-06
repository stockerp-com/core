import { useState, useRef, useEffect, useCallback } from 'react';
import { debounce, DebouncedFunction } from '../../lib/debounce.js';

export function useDebounceValue<T extends (value: string) => void>(
  callback: T,
  delay: number = 300,
) {
  const [value, setValue] = useState('');
  const debouncedCallbackRef = useRef<DebouncedFunction<T>>();

  useEffect(() => {
    debouncedCallbackRef.current = debounce(callback, delay);
  }, [callback, delay]);

  const handleValueChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (debouncedCallbackRef.current) {
      debouncedCallbackRef.current?.(...([newValue] as Parameters<T>));
    }
  }, []);

  return { value, handleValueChange };
}
