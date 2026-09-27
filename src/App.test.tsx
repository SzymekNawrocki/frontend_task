import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import products from '../public/data/products.json'
import App from './App'

function mockFetch(response: () => Promise<Response>) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(response)
}

function okResponse() {
  return Promise.resolve(new Response(JSON.stringify(products), { status: 200 }))
}

function cardCount() {
  return screen.queryAllByRole('article').length
}

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('loads products and shows the first page', async () => {
    mockFetch(okResponse)
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('Ładowanie produktów…')
    expect(await screen.findByText('Liczba wyników: 23')).toBeInTheDocument()
    expect(cardCount()).toBe(6)
  })

  it('loads more cards and hides the link at the end', async () => {
    mockFetch(okResponse)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Liczba wyników: 23')
    for (let i = 0; i < 3; i += 1) {
      await user.click(screen.getByRole('button', { name: 'Pokaż więcej' }))
    }
    expect(cardCount()).toBe(23)
    expect(screen.queryByRole('button', { name: 'Pokaż więcej' })).not.toBeInTheDocument()
  })

  it('combines dropdown filters with search and updates the URL', async () => {
    mockFetch(okResponse)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Liczba wyników: 23')

    await user.click(screen.getByRole('button', { name: /Pojemność/ }))
    await user.click(screen.getByRole('option', { name: '8 kg' }))
    await user.type(screen.getByRole('searchbox'), 'addwash')

    expect(await screen.findByText('Liczba wyników: 2')).toBeInTheDocument()
    expect(window.location.search).toBe('?q=addwash&capacity=8')
  })

  it('shows an empty state and clears filters', async () => {
    mockFetch(okResponse)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Liczba wyników: 23')

    await user.type(screen.getByRole('searchbox'), 'lodówka')
    const empty = await screen.findByText('Brak produktów spełniających kryteria')
    await user.click(within(empty.parentElement!).getByRole('button', { name: 'Wyczyść filtry' }))

    expect(await screen.findByText('Liczba wyników: 23')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('restores filters from the URL', async () => {
    window.history.replaceState(null, '', '/?energy=F')
    mockFetch(okResponse)
    render(<App />)
    expect(await screen.findByText('Liczba wyników: 1')).toBeInTheDocument()
  })

  it('shows an error and retries the request', async () => {
    const fetchMock = mockFetch(() => Promise.reject(new Error('offline')))
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Nie udało się wczytać produktów.')

    fetchMock.mockImplementation(okResponse)
    await user.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }))
    expect(await screen.findByText('Liczba wyników: 23')).toBeInTheDocument()
  })
})
