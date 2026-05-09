import API from "../utils/axiosConfig";

export const getAllEmployees = async () => {

    return await API.get("/hr/employees");
};

export const addEmployee = async (employee) => {

    return await API.post(
        "/hr/employees",
        employee
    );
};

export const getEmployeeById = async (id) => {

    return await API.get(`/employees/${id}`);
};

export const searchEmployeeByName = async (name) => {

    return await API.get(
        `/employees/name/${name}`
    );
};

export const deleteEmployee = async (id) => {

    return await API.delete(
        `/hr/employees/${id}`
    );
};