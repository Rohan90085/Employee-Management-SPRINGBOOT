import React, { useState, useEffect } from 'react';
import './Modal.css';

const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        designation: '',
        salary: ''
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                department: employee.department || '',
                designation: employee.designation || '',
                salary: employee.salary || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                department: '',
                designation: '',
                salary: ''
            });
        }
    }, [employee, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h3>{employee ? 'Edit Employee' : 'Add Employee'}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Designation</label>
                        <input type="text" name="designation" className="form-input" value={formData.designation} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Salary</label>
                        <input type="number" name="salary" className="form-input" value={formData.salary} onChange={handleChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
