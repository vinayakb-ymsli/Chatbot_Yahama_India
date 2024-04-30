import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../../assets/logo-footer-small-black.png";
import "./header.css";
import { RiUserLocationLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="#">
          <img
            alt=""
            src={logo}
            width="130"
            height="45"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto "></Nav>
          <Nav className="nav-item">
            <Nav.Link href="#product-range">Product Range</Nav.Link>
            <Nav.Link href="#buying">Buying</Nav.Link>
            <Nav.Link href="#product-range">Ownership</Nav.Link>
            <Nav.Link href="#product-range">Discover</Nav.Link>
            <Nav.Link href="https://ymsl.in">About</Nav.Link>
          </Nav>
          <Nav className="nav-item">
            <Nav.Link href="/" className="d-flex flex-column align-items-center ">
              <span>
                <RiUserLocationLine size={20} />
              </span>
              <span className="small-text">FIND A DEALER</span>
            </Nav.Link>
            <Nav.Link href="/" className="d-flex flex-column align-items-center">
              <span>
                <IoIosSearch size={22} />
              </span>
              <span className="small-text">SEARCH</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
