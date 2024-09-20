import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';

const Header: React.FC = () => {
    const logoutMutation = useMutation({
        mutationFn: () => {
            return axios.post('/auth/logout');
        },
    });
    const { auth, setAuth } = useUserStore();
    const [toggle, setToggle] = useState<boolean>(auth === null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutMutation.mutate();
        useUserStore.persist.clearStorage();
        setAuth(null);
        setToggle(true);
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/')}
                                className="me-3"
                            >
                                Home
                            </Button>
                            {toggle ? (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/login')}
                                        className="me-3"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Signup
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            navigate('/user-profile')
                                        }
                                        className="me-3"
                                    >
                                        My Account
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="primary"
                                onClick={() => navigate('/find-ticket')}
                                className="ms-3"
                            >
                                Find Ticket
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
};

export default Header;
