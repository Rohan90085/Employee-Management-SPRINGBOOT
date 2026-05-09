import { useState } from "react";

function EmployeeForm({ onSubmit }) {

    const [employee, setEmployee] = useState({

        name: "",
        email: "",
        department: "",
        designation: "",
        salary: "",
    });

    const handleChange = (e) => {

        setEmployee({
            ...employee,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(employee);
    };

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="text"
                name="department"
                placeholder="Department"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="text"
                name="designation"
                placeholder="Designation"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="number"
                name="salary"
                placeholder="Salary"
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Submit
            </button>

        </form>
    );
}

export default EmployeeForm;