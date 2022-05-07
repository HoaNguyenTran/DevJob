import { useState, useEffect } from 'react'

const useBrowserLocation = (): Record<string, any> => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          })
        },
        () => {
          setError('Lỗi định vị, vui lòng thử lại!')
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        },
      )
    } else {
      setError('Lỗi định vị, vui lòng thử lại!')
    }
  }, [])

  return { position, error }
}

export default useBrowserLocation
