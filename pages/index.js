import { useEffect, useState } from 'react'
import Context from '../context/Context'
import NavComponent from '../components/NavComponent'
import LoginComponent from '../components/LoginComponent'
import ModulesComponent from '../components/ModulesComponent'
import { Pages } from '../context/Pages'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ProfileComponent from '../components/ProfileComponent'
import StudentProfileComponent from '../components/StudentProfileComponent'

export default function Home() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(null)
  const [toast, setToast] = useState(null)
  const [profileView, setProfileView] = useState(null)
  const [openedModule, setOpenedModule] = useState(null)

  /**
   * 0 => invisible
   * 1 => fill-in-the-blanks
   * 2 => normal editor
   */
  const [editorState, setEditorState] = useState(0)

  useEffect(() => {
    const authenticatedUser = localStorage.getItem('auth')
    setUser(authenticatedUser ? JSON.parse(authenticatedUser) : null)
  }, [])

  useEffect(() => {
    setToast(null)
  }, [page, profileView, openedModule])

  if (user) {
    let currentPage = (<ModulesComponent></ModulesComponent>)

    if (page === Pages.PROFILE) {
      currentPage = (<ProfileComponent></ProfileComponent>)
    } else if (page === Pages.STUDENT_PROFILE) {
      currentPage = (<StudentProfileComponent></StudentProfileComponent>)
    }

    return (
      <Context.Provider value={{user, setUser, openedModule, setOpenedModule, page, setPage, profileView, setProfileView, toast, setToast, editorState, setEditorState}}>
        <NavComponent />
        {currentPage}
      </Context.Provider>
    )
  } else {
    return (
      <Context.Provider value={{user, setUser, openedModule, setOpenedModule, page, setPage, profileView, setProfileView, toast, setToast, editorState, setEditorState}}>
        <NavComponent />
        <LoginComponent />
      </Context.Provider>
    )
  }
}
