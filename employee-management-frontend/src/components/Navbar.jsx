import { Link } from "react-router-dom";

function Navbar() {

    const logout = () => {

        localStorage.removeItem("token");

        window.location.href = "/";
    };

    return (

        <nav>

            <Link to="/dashboard">
                Dashboard
            </Link>

            <Link to="/employees">
                Employees
            </Link>

            <Link to="/add-employee">
                Add Employee
            </Link>

            <Link to="/search">
                Search
            </Link>

            <button onClick={logout}>
                Logout
            </button>

        </nav>
    );
}

export default Navbar;