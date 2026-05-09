import Navbar from "../components/Navbar";

import EmployeeForm from "../components/EmployeeForm";

import { addEmployee } from "../services/employeeService";

function AddEmployeePage() {

    const handleAddEmployee = async (employee) => {

        try {

            await addEmployee(employee);

            alert("Employee Added Successfully");

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div>

            <Navbar />

            <div className="container">

                <div className="card">

                    <h1>Add Employee</h1>

                    <EmployeeForm
                        onSubmit={handleAddEmployee}
                    />

                </div>

            </div>

        </div>
    );
}

export default AddEmployeePage;