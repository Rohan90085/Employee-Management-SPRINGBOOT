import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmployeeModal from '../components/EmployeeModal';
import IncrementModal from '../components/IncrementModal';
import './Dashboard.css';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals state
    const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
    const [isIncModalOpen, setIsIncModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/hr/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsEmpModalOpen(true);
    };

    const handleEdit = (emp) => {
        setSelectedEmployee(emp);
        setIsEmpModalOpen(true);
    };

    const handleIncrement = (emp) => {
        setSelectedEmployee(emp);
        setIsIncModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/hr/employees/${id}`);
                fetchEmployees();
            } catch (err) {
                console.error('Error deleting employee:', err);
                alert('Failed to delete employee.');
            }
        }
    };

    const saveEmployee = async (formData) => {
        try {
            if (selectedEmployee) {
                await api.put(`/hr/employees/${selectedEmployee.id}`, formData);
            } else {
                await api.post('/hr/employees', formData);
            }
            setIsEmpModalOpen(false);
            fetchEmployees();
        } catch (err) {
            console.error('Error saving employee:', err);
            alert('Failed to save employee. Check if email is unique.');
        }
    };

    const saveIncrement = async (percentage) => {
        try {
            await api.put(`/hr/increment/${selectedEmployee.id}`, { percentage });
            setIsIncModalOpen(false);
            fetchEmployees();
        } catch (err) {
            console.error('Error incrementing salary:', err);
            alert('Failed to update salary.');
        }
    };

    return (
        <div className="dashboard-page container animate-fade-in">
            <div className="dashboard-header">
                <h2>HR Dashboard</h2>
                <button className="btn btn-primary" onClick={handleAdd}>+ Add Employee</button>
            </div>

            {loading ? (
                <div className="loading">Loading employees...</div>
            ) : (
                <div className="employee-grid">
                    {employees.map(emp => (
                        <div key={emp.id} className="employee-card glass-panel">
                            <div className="card-header">
                                <div className="card-avatar">{emp.name.charAt(0).toUpperCase()}</div>
                                <div className="card-title">
                                    <h3>{emp.name}</h3>
                                    <span className="card-subtitle">{emp.designation}</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <p><strong>ID:</strong> {emp.id}</p>
                                <p><strong>Email:</strong> {emp.email}</p>
                                <p><strong>Dept:</strong> {emp.department}</p>
                                <p><strong>Salary:</strong> ${emp.salary?.toLocaleString()}</p>
                            </div>
                            <div className="card-actions">
                                <button className="btn btn-outline" onClick={() => handleEdit(emp)}>Edit</button>
                                <button className="btn btn-outline" onClick={() => handleIncrement(emp)}>Increment</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {employees.length === 0 && (
                        <div className="empty-state glass-panel">
                            <p>No employees found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            )}

            <EmployeeModal 
                isOpen={isEmpModalOpen} 
                onClose={() => setIsEmpModalOpen(false)} 
                onSave={saveEmployee} 
                employee={selectedEmployee} 
            />

            <IncrementModal 
                isOpen={isIncModalOpen} 
                onClose={() => setIsIncModalOpen(false)} 
                onSave={saveIncrement} 
                employee={selectedEmployee} 
            />
        </div>
    );
};

export default Dashboard;
