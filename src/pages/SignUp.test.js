import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Signup from './Signup'
import { BrowserRouter } from 'react-router-dom'

const Wrapped = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Signup page validation', () => {
  test('shows errors for empty required fields and invalid email/password', () => {
    render(<Signup />, { wrapper: Wrapped })

    const submit = screen.getByRole('button', { name: /sign up/i })
    // initially disabled
    expect(submit).toBeDisabled()

    // fill only first name
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } })

    // invalid email -> shows inline error
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@notgmail.com' } })
    expect(screen.getByText(/please use a valid @gmail.com/i)).toBeInTheDocument()

    // invalid password -> shows criteria error
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'weakpass' } })
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument()

    // confirm password unmatched -> submit still disabled
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'weakpass' } })
    expect(submit).toBeDisabled()
  })

  test('enables submit when all fields valid', () => {
    render(<Signup />, { wrapper: Wrapped })

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@gmail.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'GoodP@ss1' } })
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'GoodP@ss1' } })

    const submit = screen.getByRole('button', { name: /sign up/i })
    expect(submit).toBeEnabled()
  })

  test('shows helpful message when backend is unreachable', async () => {
    render(<Signup />, { wrapper: Wrapped })

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@gmail.com' } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'GoodP@ss1' } })
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'GoodP@ss1' } })

    const submit = screen.getByRole('button', { name: /sign up/i })

    // simulate network failure
    global.fetch = jest.fn(() => Promise.reject(new Error('connect ECONNREFUSED')))

    fireEvent.click(submit)

    // the UI should show the new friendly network message
    const el = await screen.findByText(/Unable to contact backend/i)
    expect(el).toBeInTheDocument()
  })
})
