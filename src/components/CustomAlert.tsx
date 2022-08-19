import { Alert } from "@mui/material";

const CustomAlert = ({ type }: { type: "success" | "invalid" | "duplicate" | null }): JSX.Element | null => {
  switch (type) {
    case "success":
      return (
        <Alert className="absolute bottom-[76px]" severity="success">
          Successfully submitted.
        </Alert>
      );
    case "invalid":
      return (
        <Alert className="absolute bottom-[76px]" severity="error">
          Error: Form is invalid.
        </Alert>
      );
    case "duplicate":
      return (
        <Alert className="absolute bottom-[76px]" severity="error">
          Duplicate Employee.
        </Alert>
      );
    default:
      return null;
  }
};

export default CustomAlert;
