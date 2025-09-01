import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export const addMeal = async (meal) => {
  await addDoc(collection(db, "meals"), meal);
};

export const getMeals = async (userId) => {
  const q = query(collection(db, "meals"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateMeal = async (id, meal) => {
  await updateDoc(doc(db, "meals", id), meal);
};

export const deleteMeal = async (id) => {
  await deleteDoc(doc(db, "meals", id));
};

export const fetchMockRecipes = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
  );
  const data = await res.json();
  return data.meals;
};
