import {useState, useEffect} from 'react'

export const useSocketUpdates = socket => {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    // first, mount component
    let isMounted = true

    // socket update logic
    if (isMounted) {
      socket.on('should-update', () => {
        console.log('update msg received in useSocketUpdates!')
        setFlag(!flag)
      })
    }

    // cleanup func unmounts component and leaves socket room
    return () => {
      isMounted = false
    }
  })

  return flag
}
