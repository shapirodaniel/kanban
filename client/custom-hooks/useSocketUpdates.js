import {useState, useEffect} from 'react'

export const useSocketUpdates = socket => {
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    // socket update logic
    socket.on('should-update', () => {
      console.log('update msg received in useSocketUpdates!')
      setFlag(!flag)
    })
  })

  return flag
}
