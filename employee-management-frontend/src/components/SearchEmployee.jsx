import { useState } from "react";

function SearchEmployee({ onSearch }) {

    const [name, setName] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        onSearch(name);
    };

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Search by Name"
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <button type="submit">
                Search
            </button>

        </form>
    );
}

export default SearchEmployee;