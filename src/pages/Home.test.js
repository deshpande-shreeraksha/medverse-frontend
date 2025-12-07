import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './Home'
import { AuthContext } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'

const Wrapped = ({ children, value }) => (
  <AuthContext.Provider value={value}>
    <BrowserRouter>{children}</BrowserRouter>
  </AuthContext.Provider>
)

test('shows greeting when user is logged in', () => {
  const user = { firstName: 'Jane', lastName: 'Doe' }
  render(<Home />, { wrapper: ({ children }) => <Wrapped value={{ token: 'abc', user }}>{children}</Wrapped> })

  expect(screen.getByText(/Welcome back, Jane Doe/i)).toBeInTheDocument()
  expect(screen.queryByText(/Create free account/i)).toBeNull()
})

test('shows signup CTA when no user', () => {
  render(<Home />, { wrapper: ({ children }) => <Wrapped value={{ token: null, user: null }}>{children}</Wrapped> })
  expect(screen.getByText(/Join MedVerse/i)).toBeInTheDocument()
  expect(screen.getByText(/Create free account/i)).toBeInTheDocument()
})
