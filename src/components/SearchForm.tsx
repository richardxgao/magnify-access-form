import { useEffect, useState } from "react";

import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Employee, getEmployees } from "../api/FirebaseAPI";
import { DocumentData } from "firebase/firestore";

const convertDataToEmployee = (employee: DocumentData): Employee => {
  const employeeData: Employee = {
    name: employee.name,
    id: employee.id,
    department: employee.department,
    employmentStatus: employee.employmentStatus,
    email: employee.email,
    additionalDocuments: employee?.additionalDocuments,
  };
  return employeeData;
};

const employmentCodeToString: { [key: string]: string } = {
  0: "Unemployed",
  1: "Employed",
};

const SearchForm = () => {
  const [originalData, setOriginalData] = useState<Employee[]>([]);
  const [data, setData] = useState<Employee[]>([]);
  const [name, setName] = useState<string>("");
  const [id, setID] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [employmentStatus, setEmploymentStatus] = useState<string>("");

  const getEmployeeData = async () => {
    setData([]);
    const employeeData: DocumentData[] = await getEmployees();
    employeeData.map((employee) =>
      setOriginalData((originalData) => [...originalData, convertDataToEmployee(employee)])
    ); // VERY BAD HERE
    employeeData.map((employee) => setData((data) => [...data, convertDataToEmployee(employee)]));
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  useEffect(() => {
    setData([]);
    let filteredData: Employee[] = originalData;
    filteredData = nameFilter(filteredData);
    filteredData = idFilter(filteredData);
    filteredData = emailFilter(filteredData);
    filteredData = departmentFilter(filteredData);
    filteredData = employmentStatusFilter(filteredData);
    setData(filteredData);
  }, [name, id, email, department, employmentStatus]);

  const nameFilter = (data: Employee[]): Employee[] => {
    return name.length !== 0
      ? data.filter((employee: Employee) => employee.name.toLowerCase().includes(name.toLowerCase()))
      : data;
  };

  const idFilter = (data: Employee[]): Employee[] => {
    return id.length !== 0
      ? data.filter((employee: Employee) => employee.id.toLowerCase().includes(id.toLowerCase()))
      : data;
  };

  const emailFilter = (data: Employee[]): Employee[] => {
    return email.length !== 0
      ? data.filter((employee: Employee) => employee.email.toLowerCase().includes(email.toLowerCase()))
      : data;
  };

  const departmentFilter = (data: Employee[]): Employee[] => {
    return department.length !== 0
      ? data.filter((employee: Employee) => employee.department.toLowerCase().includes(department.toLowerCase()))
      : data;
  };

  const employmentStatusFilter = (data: Employee[]): Employee[] => {
    return employmentStatus === "1" || employmentStatus === "0"
      ? data.filter((employee: Employee) => employee.employmentStatus === employmentStatus)
      : data;
  };

  const resetFilters = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setID("");
    setEmploymentStatus("");
    setData(originalData);
  };

  return (
    <div className="w-[90%] p-10 flex flex-col justify-center items-center bg-white rounded-xl">
      <div className="w-full flex items-start gap-4 mb-10">
        <div className="flex-1 flex flex-col">
          <TextField
            name="name"
            label="Full Name"
            variant="standard"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <TextField name="id" label="ID" variant="standard" value={id} onChange={(e: any) => setID(e.target.value)} />
          <TextField
            name="email"
            label="Email"
            variant="standard"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <TextField
            name="department"
            label="Department"
            variant="standard"
            value={department}
            onChange={(e: any) => setDepartment(e.target.value)}
          />
          <FormControl variant="standard">
            <InputLabel>Employment Status</InputLabel>
            <Select
              value={employmentStatus}
              label="Employment Status"
              onChange={(e: any) => setEmploymentStatus(e.target.value)}
            >
              <MenuItem value={"1"}>Employed</MenuItem>
              <MenuItem value={"0"}>Unemployed</MenuItem>
            </Select>
          </FormControl>
          <div className="mt-4 flex justify-center">
            <Button variant="contained" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <h2>Name</h2>
              </TableCell>
              <TableCell align="right">
                <h2 className="font-bold">ID</h2>
              </TableCell>
              <TableCell align="right">
                <h2 className="font-bold">Department</h2>
              </TableCell>
              <TableCell align="right">
                <h2 className="font-bold">Employment</h2>
              </TableCell>
              <TableCell align="right">
                <h2 className="font-bold">Email</h2>
              </TableCell>
              <TableCell align="right">
                <h2 className="font-bold">Attachments</h2>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((employee: Employee) => (
              <TableRow key={employee.id}>
                <TableCell component="th" className="whitespace-nowrap" scope="employee">
                  {employee.name}
                </TableCell>
                <TableCell align="right">{employee.id}</TableCell>
                <TableCell align="right">{employee.department}</TableCell>
                <TableCell align="right">{employmentCodeToString[employee.employmentStatus]}</TableCell>
                <TableCell align="right">{employee.email}</TableCell>
                <TableCell align="right">
                  <a
                    className="text-blue-600"
                    href={employee.additionalDocuments?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {employee.additionalDocuments?.fileName}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SearchForm;
