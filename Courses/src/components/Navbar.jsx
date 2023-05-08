import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import CartWidget from './CartWidget';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

export default function TopNavBar({ onSearch }) {
    const [user, setUser] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        const user = JSON.parse(window.sessionStorage.getItem("currentUser"))
        if(user) {
            setUser(user)
            console.log("not NUll")
            console.log(typeof user)
            console.log(user)
        } else {
            console.log("is NUll")
            window.location.replace("/")
        }
    }, [])
    return (
        <Navbar sticky="top" bg="light" expand="lg" className='pad-bottom '>
            <Container fluid>
                <Navbar.Brand href="/courses">Course Scheduler</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/courses">Courses</Nav.Link>
                        <Nav.Link href="/teachers">Teachers</Nav.Link>
                        {user.account === 'teacher' ? <Nav.Link href="/students">Students</Nav.Link> : <></>}
                        {user.account === 'student' ? <Nav.Link href="/schedule">Schedule</Nav.Link> : <></>}
                        
      
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value)
                                onSearch(e.target.value)
                            }}
                        />
                        <button className='btn btn-outline-dark mar-start' onClick={() => {
                            navigate("/", { replace: true })
                            window.sessionStorage.setItem("currentUser",null);
                        }}>Logout</button>
                    </Form>
                    {/* <CartWidget /> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
