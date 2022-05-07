import { useEffect, useState } from 'react'

export const useDebounceFunction = (callback, delay) => {
  let timeout: any = null
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    await callback()
    clearTimeout(timeout)
  }, delay)
}


export function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
