import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './Login'
import { AuthContext } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'

const Wrapped = ({ children }) => (
  <AuthContext.Provider value={{ setToken: jest.fn(), setUser: jest.fn() }}>
    <BrowserRouter>{children}</BrowserRouter>
  </AuthContext.Provider>
)

test('shows helpful message when backend is unreachable', async () => {
  render(<Login />, { wrapper: Wrapped })

  // fill inputs
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@gmail.com' } })
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'TestP@ss1' } })

  // simulate network failure
  global.fetch = jest.fn(() => Promise.reject(new Error('connect ECONNREFUSED')))

  fireEvent.click(screen.getByRole('button', { name: /login/i }))

  const el = await waitFor(() => screen.getByText(/Unable to contact backend/i))
  expect(el).toBeInTheDocument()
})
