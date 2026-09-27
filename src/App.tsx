import styles from './App.module.css'
import { Catalog } from './components/Catalog/Catalog'
import { Header } from './components/Header/Header'
import { StatusMessage } from './components/StatusMessage/StatusMessage'
import { useProducts } from './hooks/useProducts'

export default function App() {
  const catalog = useProducts()

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {catalog.status === 'loading' && <StatusMessage message="Ładowanie produktów…" />}
          {catalog.status === 'error' && (
            <StatusMessage
              role="alert"
              message="Nie udało się wczytać produktów."
              action={{ label: 'Spróbuj ponownie', onClick: catalog.retry }}
            />
          )}
          {catalog.status === 'success' && <Catalog products={catalog.products} />}
        </div>
      </main>
    </>
  )
}
