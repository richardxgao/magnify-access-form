import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, useState } from "react";
import CustomAlert from "./components/CustomAlert";
import { createEmployee } from "./api/FirebaseAPI";

export interface Employee {
  name: string;
  id: string;
  department: string;
  employmentStatus: string;
  email: string;
  additionalDocuments?: string;
}

const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

const validateForm = (employee: Employee): boolean => {
  if (employee.name.length === 0) {
    return false;
  }
  if (employee.id.length === 0) {
    return false;
  }
  if (employee.department.length === 0) {
    return false;
  }
  if (employee.employmentStatus.length === 0) {
    return false;
  }
  if (!validateEmail(employee.email)) {
    return false;
  }
  return true;
};

const App = () => {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    id: "",
    department: "",
    employmentStatus: "",
    email: "",
  });
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [alert, setAlert] = useState<boolean>(false);
  const [successfulSubmission, setSuccessfulSubmission] = useState<boolean>(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setEmployee({ ...employee, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleEmploymentStatusChange = (e: SelectChangeEvent): void => {
    setEmployee({ ...employee, employmentStatus: e.target.value });
  };

  const handleSubmit = async () => {
    const validForm = validateForm(employee);
    if (!validForm) {
      setSuccessfulSubmission(false);
    } else {
      const submissionStatus: boolean = await createEmployee(employee);
      setSuccessfulSubmission(submissionStatus);
    }
    setAlert(true);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {alert && <CustomAlert type={successfulSubmission} />}
      <form className="rounded-xl flex flex-col justify-center bg-white gap-4 p-8">
        <h1>Identification Information</h1>
        <TextField
          required
          name="name"
          label="Full Name"
          variant="standard"
          value={employee.name}
          onChange={handleOnChange}
        />
        <TextField required name="id" label="ID" variant="standard" value={employee.id} onChange={handleOnChange} />
        <TextField
          required
          name="department"
          label="Department"
          variant="standard"
          value={employee.department}
          onChange={handleOnChange}
        />
        <FormControl required variant="standard">
          <InputLabel>Employment Status</InputLabel>
          <Select value={employee.employmentStatus} label="Employment Status" onChange={handleEmploymentStatusChange}>
            <MenuItem value={1}>Employed</MenuItem>
            <MenuItem value={0}>Unemployed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          error={!validEmail}
          required
          name="email"
          label="Email"
          variant="standard"
          value={employee.email}
          onChange={(e) => {
            const isValidEmail: boolean = validateEmail(e.target.value);
            setValidEmail(isValidEmail);
            handleOnChange(e);
          }}
        />
        <h1 className="mt-4">Additional Documents</h1>
        <Button color="secondary" variant="contained" component="label">
          Upload
          <input hidden accept="application/pdf" multiple type="file" />
        </Button>
        <div className="flex flex-col mt-8">
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default App;
