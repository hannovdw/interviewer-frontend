import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from "next/router"

export default function Header(props) {

  const router = useRouter()

  async function signOut() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (

    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">

      <Container>

        <Navbar.Brand href="/overview">Interviewer</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="me-auto">

            <Nav.Link href="/overview">Overview</Nav.Link>
            <Nav.Link href="/overview">Interviews</Nav.Link>
            <Nav.Link href="/candidates/add">Candidates</Nav.Link>
            <Nav.Link href="/overview">Employees</Nav.Link>
            <Nav.Link href="/overview">Templates</Nav.Link>

            {/* <NavDropdown title="Interviews" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/">Create Interview</NavDropdown.Item>
              <NavDropdown.Item href="/interview">View Interviews </NavDropdown.Item>
            </NavDropdown> */}

          </Nav>

          <Nav>
            <NavDropdown title="Profile" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={signOut}>Sign Out</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">Help</NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>

  )
}
