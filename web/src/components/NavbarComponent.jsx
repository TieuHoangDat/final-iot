import React from 'react';
import { Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg" className="">
      {/* <Navbar.Brand href="#home">YourBrand</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/home">Trang chủ</Nav.Link>
          <Nav.Link href="/diagram">Biểu đồ</Nav.Link>
          <Nav.Link href="/introduce">Giới thiệu</Nav.Link>
        </Nav>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
