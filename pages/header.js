import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useRouter } from "next/router"
import Image from "next/image";

export default function Header(props) {

  const router = useRouter()

  async function signOut() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (

    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary border">

      <Container>

        <Navbar.Brand href="/calendar">
          <div className="col text-center">
            <Image
              src="/../public/logo1.png"
              width={300}
              height={100}
              alt="Logo"
              className="img-fluid center-block"
            />
          </div></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="h5 me-auto">

            <Nav.Link href="/calendar">Calendar</Nav.Link>
            <Nav.Link href="/interviews/interviews">Interviews</Nav.Link>
            <Nav.Link href="/candidates/candidates">Candidates</Nav.Link>
            <Nav.Link href="/employees/employees">Employees</Nav.Link>
            <Nav.Link href="/overview">Templates</Nav.Link>


          </Nav>

          <Nav>
            <NavDropdown title="Profile" className='h5' id="collasible-nav-dropdown">
              <NavDropdown.Item href="/profile"><h6>My Profile</h6></NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3"><h6>Settings</h6></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={signOut}><h6>Sign Out</h6></NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4"><h6>Help</h6></NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>

  )
}
