import { collection, getDocs, setDoc, doc, query, where, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "../providers/FirebaseProvider";
import { Employee } from "../App";

const employeesRef = collection(db, "employees");

export const checkIfEmployeeExists = async (employee: Employee): Promise<boolean> => {
  const q = query(employeesRef, where("email", "==", employee.email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    console.log("Employee with email already exists.");
    return true;
  }
  return false;
};

export const createEmployee = async (employee: Employee): Promise<boolean> => {
  const exists = await checkIfEmployeeExists(employee);
  if (!exists) {
    const newDocRef = doc(employeesRef);
    await setDoc(newDocRef, { ...employee, id: newDocRef.id });
    return true;
  }
  return false;
};

export const getEmployees = async (): Promise<DocumentData[]> => {
  const data = await getDocs(employeesRef);
  const employees: DocumentData[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return employees;
};
