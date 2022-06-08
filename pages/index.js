import { useEffect, useState } from 'react'
import Context from '../context/Context'
import NavComponent from '../components/NavComponent'
import LoginComponent from '../components/LoginComponent'
import ModulesComponent from '../components/ModulesComponent'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [openedModule, setOpenedModule] = useState(null)

  useEffect(() => {
    const authenticatedUser = localStorage.getItem('auth')
    setUser(authenticatedUser ? JSON.parse(authenticatedUser) : null)
  }, []);

  if (user) {
    return (
      <Context.Provider value={{user, setUser, openedModule, setOpenedModule, profile, setProfile}}>
        <NavComponent />
        <ModulesComponent />
      </Context.Provider>
    )
  } else {
    return (
      <Context.Provider value={{user, setUser, openedModule, setOpenedModule, profile, setProfile}}>
        <NavComponent />
        <LoginComponent />
      </Context.Provider>
    )
  }
}
