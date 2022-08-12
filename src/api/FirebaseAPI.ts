import { collection, getDocs, setDoc, doc, query, where, DocumentData } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../providers/FirebaseProvider";

interface AdditionalDocuments {
  fileName: string;
  url: string;
}

export interface Employee {
  name: string;
  id: string;
  department: string;
  employmentStatus: string;
  email: string;
  additionalDocuments?: AdditionalDocuments;
}

const employeesRef = collection(db, "employees");
const storage = getStorage();

export const checkIfEmployeeExists = async (employee: Employee): Promise<boolean> => {
  const q = query(employeesRef, where("email", "==", employee.email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0;
};

export const createEmployee = async (employee: Employee): Promise<void> => {
  const newDocRef = doc(employeesRef);
  await setDoc(newDocRef, { ...employee });
};

export const getEmployees = async (): Promise<DocumentData[]> => {
  const data = await getDocs(employeesRef);
  const employees: DocumentData[] = data.docs.map((doc) => ({ ...doc.data() }));
  return employees;
};

export const uploadEmployeeFile = async (file: File, employee: Employee): Promise<string> => {
  const storageRef = ref(storage, `employees/${employee.email}/${file.name}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
