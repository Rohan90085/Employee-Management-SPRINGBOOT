import React, { useState } from 'react';
import api from '../services/api';
import './Home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setEmployee(null);

        try {
            // First try by ID
            if (!isNaN(searchQuery)) {
                try {
                    const res = await api.get(`/employees/${searchQuery}`);
                    if (res.data) setEmployee(res.data);
                } catch (err) {
                    // Ignore error, try by name next
                }
            }

            if (!employee) {
                const res = await api.get(`/employees/name/${searchQuery}`);
                if (res.data && res.data.length > 0) {
                    setEmployee(res.data[0]); // Just taking the first match for simplicity
                } else {
                    setError('No employee found with that criteria.');
                }
            }
        } catch (err) {
            setError('Error searching for employee.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page container animate-fade-in">
            <div className="search-section glass-panel">
                <h1 className="hero-title">Employee Portal</h1>
                <p className="hero-subtitle">Search for an employee by Name or ID</p>
                
                <form onSubmit={handleSearch} className="search-form">
                    <input 
                        type="text" 
                        className="form-input search-input" 
                        placeholder="Enter Employee ID or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {employee && (
                    <div className="employee-result glass-panel animate-fade-in">
                        <div className="employee-avatar">
                            {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="employee-details">
                            <h2>{employee.name}</h2>
                            <p className="emp-designation">{employee.designation}</p>
                            <p className="emp-department"><strong>Dept:</strong> {employee.department}</p>
                            <p className="emp-email"><strong>Email:</strong> {employee.email}</p>
                            <p className="emp-id"><strong>Employee ID:</strong> {employee.id}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
