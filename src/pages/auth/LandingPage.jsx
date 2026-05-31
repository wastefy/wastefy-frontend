import { useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { SCREENS } from '../../constants'

export default function LandingPage() {
  const { navigate } = useApp()

  useEffect(() => {
    navigate(SCREENS.SIGNUP)
  }, [])

  return null
}