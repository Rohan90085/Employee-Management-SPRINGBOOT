function EmployeeTable({ employees }) {

    return (

        <table border="1">

            <thead>

            <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>

            </tr>

            </thead>

            <tbody>

            {employees.map((employee) => (

                <tr key={employee.id}>

                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.salary}</td>

                </tr>

            ))}

            </tbody>

        </table>
    );
}

export default EmployeeTable;