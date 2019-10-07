import React from 'react';
import './App.css';

import { Button,Navbar,Nav,Form,FormControl,Dropdown } from 'react-bootstrap';

         function Header() {
          return (
            <div className="headerC">
             <>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home"></Navbar.Brand>
            <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Filter
          </Dropdown.Toggle>
        
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">100-1000</Dropdown.Item>
            <Dropdown.Item href="#/action-2">1000-5000</Dropdown.Item>
            <Dropdown.Item href="#/action-3">5000-MAX</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
           <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar>
        </>
      </div>
        );
         }
         export default Header;