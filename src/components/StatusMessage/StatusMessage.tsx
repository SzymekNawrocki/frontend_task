import styles from './StatusMessage.module.css'

interface StatusMessageProps {
  role?: 'status' | 'alert'
  message: string
  action?: { label: string; onClick: () => void }
}

export function StatusMessage({ role = 'status', message, action }: StatusMessageProps) {
  return (
    <div className={styles.box} role={role}>
      <p className={styles.message}>{message}</p>
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
