import { ChangeEvent, useState } from "react";
import CustomAlert from "./CustomAlert";
import { Employee, createEmployee, checkIfEmployeeExists, uploadEmployeeFile } from "../api/FirebaseAPI";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { SelectChangeEvent } from "@mui/material/Select";

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

const emptyEmployee: Employee = {
  name: "",
  id: "",
  department: "",
  employmentStatus: "",
  email: "",
};

const SubmitForm = () => {
  const [employee, setEmployee] = useState<Employee>(emptyEmployee);
  const [file, setFile] = useState<null | File>(null);
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [alert, setAlert] = useState<"success" | "invalid" | "duplicate" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setEmployee({ ...employee, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleEmploymentStatusChange = (e: SelectChangeEvent): void => {
    setEmployee({ ...employee, employmentStatus: String(e.target.value) });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);

    const validForm = validateForm(employee);
    if (!validForm) {
      setAlert("invalid");
      setLoading(false);
      return;
    }

    const employeeExists: boolean = await checkIfEmployeeExists(employee);
    if (employeeExists) {
      setAlert("duplicate");
      setLoading(false);
      return;
    }

    if (file !== null && file !== undefined) {
      const downloadURL = await uploadEmployeeFile(file, employee);
      await createEmployee({ ...employee, additionalDocuments: { fileName: file.name, url: downloadURL } });
    } else {
      await createEmployee(employee);
    }

    setAlert("success");
    setLoading(false);
  };

  const handleClear = () => {
    setFile(null);
    setEmployee(emptyEmployee);
    setAlert(null);
  };

  return (
    <div className="relative flex flex-col justify-center items-center">
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
            <MenuItem value={"1"}>Employed</MenuItem>
            <MenuItem value={"0"}>Unemployed</MenuItem>
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
          Upload (pdf)
          <input hidden accept="application/pdf" type="file" onChange={(e: any) => setFile(e.target.files[0])} />
        </Button>
        <p className="text-center">{file?.name}</p>
        <div className="flex justify-items-stretch mt-8 gap-4">
          <LoadingButton loading={loading} className="flex-1" variant="contained" onClick={handleSubmit}>
            Submit
          </LoadingButton>
          <Button className="flex-1" variant="contained" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </form>
      {alert && <CustomAlert type={alert} />}
    </div>
  );
};

export default SubmitForm;
