import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-panel">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <h2>EMS</h2>
                </Link>
                <ul className="navbar-links">
                    <li>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-outline nav-btn">Logout</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login" className="btn btn-primary nav-btn">HR Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;