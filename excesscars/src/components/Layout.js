import React, { useState } from 'react';
import { Outlet } from 'react-router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Container
} from 'reactstrap';
import { FaPhoneAlt, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import ridebaitlogo from '../images/ridebaitcartransparent.png';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/vehicles", label: "Vehicles" },
    { path: "/howitworks", label: "How It Works" },
    { path: "/contactus", label: "Contact Us" }
  ];

  return (
    <div>
      {/* Clean Compact Navbar */}
      <Navbar
        expand="md"
        dark
        style={{
          background: 'linear-gradient(90deg, #0f6eea 0%, #093e9e 100%)'
        }}
      >
        <Container>
          {/* Brand + Toggler Row */}
          <div className="d-flex align-items-center justify-content-between w-100">
            <NavbarBrand href="/" className="d-flex align-items-center gap-2">
              <img
                src={ridebaitlogo}
                alt="RideBait"
                style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <span className="fw-bold text-white" style={{ fontSize: '1.05rem', letterSpacing: '0.2px' }}>
                RideBait
              </span>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} className="border-0" />
          </div>

          {/* Collapsible Nav */}
          <Collapse isOpen={isOpen} navbar>
            <Nav
            style={window.innerWidth < 600 ? {marginTop:'-0px'} : {marginTop:'-50px'}}
              navbar
              className="ms-auto d-flex flex-column flex-md-row align-items-start align-items-md-center"
            >
              {navLinks.map((link) => (
                <NavItem key={link.path}>
                  <NavLink
                    href={link.path}
                    className="px-2 px-md-3 nav-link-clean"
                    style={{
                      color: '#ffffff',
                      fontWeight: 500
                    }}
                  >
                    {link.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#1a1d20',
          color: '#f8f9fa',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          marginTop: '3rem'
        }}
      >
        <Container>
          <Row className="gy-4">
            <Col md={4}>
              <h5 className="fw-bold text-white mb-3">RideBait</h5>
              <p style={{ color: '#adb5bd' }}>
                Where motivated dealers meet ready buyers. Real deals, no endless listings. <br/> <a href='/termsandconditions'>Terms & Conditions</a>
              </p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold text-white mb-3">Contact Us</h6>
              <p style={{ color: '#adb5bd' }} className="mb-1">
                <FaMapMarkerAlt className="me-2 text-warning" /> 16010 Barkera Point, Houston 77079
              </p>
              <p style={{ color: '#adb5bd' }} className="mb-1">
                <FaPhoneAlt className="me-2 text-warning" /> 713-367-1577
              </p>
              <p style={{ color: '#adb5bd' }}>
                <FaClock className="me-2 text-warning" /> Mon - Sat: 9am - 5pm<br />Sun: Closed
              </p>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold text-white mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-secondary fs-5 social-icon"><FaFacebook /></a>
                <a href="#" className="text-secondary fs-5 social-icon"><FaTwitter /></a>
                <a href="#" className="text-secondary fs-5 social-icon"><FaInstagram /></a>
              </div>
            </Col>
          </Row>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <p className="text-center mb-0" style={{ color: '#6c757d' }}>
            &copy; {new Date().getFullYear()} RideBait. All rights reserved.
          </p>
        </Container>

        <style>
          {`
            .nav-link-clean {
              transition: color 0.2s ease;
            }
            .nav-link-clean:hover { color: #ffc107 !important; }
            .social-icon:hover {
              color: #ffc107 !important;
              transform: scale(1.12);
              transition: all 0.25s ease;
            }
          `}
        </style>
      </footer>
    </div>
  );
}

export default Layout;
