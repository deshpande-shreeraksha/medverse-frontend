import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, DropdownButton, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

const Header = () => {
  const { user, activeRole, switchRole, logout } = useContext(AuthContext);

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/dashboard/admin';
    if (user?.role === 'doctor') return '/dashboard/doctor';
    return '/dashboard';
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          MedVerse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={NavLink} to={getDashboardPath()}>
                  Dashboard
                </Nav.Link>
                {/* Show role switcher only if user has multiple roles */}
                {user.roles && user.roles.length > 1 && (
                  <DropdownButton
                    align="end"
                    title={`Role: ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
                    id="role-switcher-dropdown"
                    variant="outline-secondary"
                    size="sm"
                    className="mx-2"
                  >
                    {user.roles.map((role) => (
                      <Dropdown.Item key={role} onClick={() => switchRole(role)} active={role === activeRole}>
                        Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                )}
                <Nav.Link onClick={logout} className="text-danger">Log Out</Nav.Link>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;