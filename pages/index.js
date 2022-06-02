import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Login from '../components/Login'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Introduction to Python</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Introduction to Python
        </h1>

        <Login />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
