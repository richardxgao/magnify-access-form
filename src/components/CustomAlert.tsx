import { Alert, AlertTitle } from "@mui/material";

const CustomAlert = ({ type }: { type: boolean }) => {
  return type ? (
    <div className="absolute bottom-4">
      <Alert severity="success">Successfully submitted</Alert>
    </div>
  ) : (
    <div className="absolute bottom-4">
      <Alert severity="error">Error: Form is invalid.</Alert>
    </div>
  );
};

export default CustomAlert;
