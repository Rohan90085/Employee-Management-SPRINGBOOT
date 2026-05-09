import { useState } from "react";

import Navbar from "../components/Navbar";

import SearchEmployee from "../components/SearchEmployee";

import EmployeeTable from "../components/EmployeeTable";

import { searchEmployeeByName } from "../services/employeeService";

function EmployeeSearchPage() {

    const [employees, setEmployees] = useState([]);

    const handleSearch = async (name) => {

        try {

            const response =
                await searchEmployeeByName(name);

            setEmployees(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div>

            <Navbar />

            <div className="container">

                <div className="card">

                    <h1>Search Employee</h1>

                    <div className="search-box">

                        <SearchEmployee
                            onSearch={handleSearch}
                        />

                    </div>

                    <EmployeeTable
                        employees={employees}
                    />

                </div>

            </div>

        </div>
    );
}

export default EmployeeSearchPage;