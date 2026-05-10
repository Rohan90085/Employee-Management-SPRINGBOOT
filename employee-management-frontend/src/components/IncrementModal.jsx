import React, { useState } from 'react';
import './Modal.css';

const IncrementModal = ({ isOpen, onClose, onSave, employee }) => {
    const [percentage, setPercentage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(parseFloat(percentage));
        setPercentage('');
    };

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h3>Increment Salary for {employee?.name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Increment Percentage (%)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            className="form-input" 
                            value={percentage} 
                            onChange={(e) => setPercentage(e.target.value)} 
                            required 
                            placeholder="e.g. 10.5"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Apply</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncrementModal;
