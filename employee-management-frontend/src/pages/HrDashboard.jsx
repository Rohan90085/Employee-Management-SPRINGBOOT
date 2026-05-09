import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HrDashboard() {

    return (

        <div>

            <Navbar />

            <div className="container">

                <h1>HR Dashboard</h1>

                <div className="dashboard-grid">

                    <div className="dashboard-card">

                        <h3>View Employees</h3>

                        <Link to="/employees">
                            Open
                        </Link>

                    </div>

                    <div className="dashboard-card">

                        <h3>Add Employee</h3>

                        <Link to="/add-employee">
                            Open
                        </Link>

                    </div>

                    <div className="dashboard-card">

                        <h3>Search Employee</h3>

                        <Link to="/search">
                            Open
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HrDashboard;