import { Alert } from "@mui/material";

const CustomAlert = ({ type }: { type: "success" | "invalid" | "duplicate" | null }) => {
  let AlertType = <div></div>;
  if (type === "success") {
    AlertType = (
      <div className="absolute bottom-[76px]">
        <Alert severity="success">Successfully submitted.</Alert>
      </div>
    );
  } else if (type === "invalid") {
    AlertType = (
      <div className="absolute bottom-[76px]">
        <Alert severity="error">Error: Form is invalid.</Alert>
      </div>
    );
  } else if (type === "duplicate") {
    AlertType = (
      <div className="absolute bottom-[76px]">
        <Alert severity="error">Duplicate Employee.</Alert>
      </div>
    );
  }

  return AlertType;
};

export default CustomAlert;
