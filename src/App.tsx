import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, useState } from "react";
import CustomAlert from "./components/CustomAlert";
import { db } from "../providers/FirebaseProvider";

interface Identification {
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

const validateForm = (identification: Identification): boolean => {
  if (identification.name.length === 0) {
    return false;
  }
  if (identification.id.length === 0) {
    return false;
  }
  if (identification.department.length === 0) {
    return false;
  }
  if (identification.employmentStatus.length === 0) {
    return false;
  }
  if (!validateEmail(identification.email)) {
    return false;
  }
  return true;
};

const App = () => {
  const [identification, setIdentification] = useState<Identification>({
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
    setIdentification({ ...identification, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleEmploymentStatusChange = (e: SelectChangeEvent): void => {
    setIdentification({ ...identification, employmentStatus: e.target.value });
  };

  const handleSubmit = () => {
    const validForm = validateForm(identification);
    setSuccessfulSubmission(validForm);
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
          value={identification.name}
          onChange={handleOnChange}
        />
        <TextField
          required
          name="id"
          label="ID"
          variant="standard"
          value={identification.id}
          onChange={handleOnChange}
        />
        <TextField
          required
          name="department"
          label="Department"
          variant="standard"
          value={identification.department}
          onChange={handleOnChange}
        />
        <FormControl required variant="standard">
          <InputLabel>Employment Status</InputLabel>
          <Select
            value={identification.employmentStatus}
            label="Employment Status"
            onChange={handleEmploymentStatusChange}
          >
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
          value={identification.email}
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
