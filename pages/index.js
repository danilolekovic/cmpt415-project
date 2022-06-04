import { useState } from 'react';
import styles from '../styles/Home.module.css'
import NavComponent from '../components/NavComponent'
import LoginComponent from '../components/LoginComponent'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const [user, setUser] = useState(null)
  
  return (
    <div className={styles.container}>
      <NavComponent />
      <LoginComponent />
    </div>
  )
}
