import styles from './GuestLayout.module.css'
import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <div>
        <Link href="/">
          <h1 className={styles.title}>{import.meta.env.VITE_APP_NAME}</h1>
        </Link>
      </div>

      <div className="p-3 w-full max-w-lg">
        {children}
      </div>
    </div>
  )
}
