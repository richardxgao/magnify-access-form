import { Button } from "@mui/material";
import { useState } from "react";
import SearchForm from "./components/SearchForm";
import SubmitForm from "./components/SubmitForm";

const App = () => {
  const [form, setForm] = useState<"Submit" | "Search">("Submit");

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center gap-4 mt-10 mb-16">
        <Button variant="contained" onClick={() => setForm("Submit")}>
          Submit Form
        </Button>
        <Button variant="contained" onClick={() => setForm("Search")}>
          Search Form
        </Button>
      </div>
      <h1 className="mb-5">{form} Form</h1>
      {form === "Submit" ? <SubmitForm /> : <SearchForm />}
    </div>
  );
};

export default App;
