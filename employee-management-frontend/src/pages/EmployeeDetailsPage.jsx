import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import { getEmployeeById } from "../services/employeeService";

function EmployeeDetailsPage() {

    const { id } = useParams();

    const [employee, setEmployee] =
        useState(null);

    useEffect(() => {

        fetchEmployee();

    }, []);

    const fetchEmployee = async () => {

        try {

            const response =
                await getEmployeeById(id);

            setEmployee(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    if (!employee) {

        return <h2>Loading...</h2>;
    }

    return (

        <div>

            <Navbar />

            <div className="container">

                <div className="card">

                    <h1>Employee Details</h1>

                    <p><b>ID:</b> {employee.id}</p>

                    <p><b>Name:</b> {employee.name}</p>

                    <p><b>Email:</b> {employee.email}</p>

                    <p><b>Department:</b> {employee.department}</p>

                    <p><b>Designation:</b> {employee.designation}</p>

                    <p><b>Salary:</b> {employee.salary}</p>

                </div>

            </div>

        </div>
    );
}

export default EmployeeDetailsPage;