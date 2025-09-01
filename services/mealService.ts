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
  getDoc,
} from "firebase/firestore";

// Collection reference for meals
export const mealColRef = collection(db, "meals");

// Add a new meal
export const createMeal = async (meal: { title: string; description: string; }) => {
  const docRef = await addDoc(mealColRef, meal);
  return docRef.id;
};

// Get a single meal by ID
export const getMealById = async (id: string) => {
  const docRef = doc(db, "meals", id);
  const mealSnap = await getDoc(docRef);
  if (mealSnap.exists()) {
    return { id: mealSnap.id, ...mealSnap.data() };
  }
  return null;
};

// Get all meals (admin or for listing all meals)
export const getAllMealData = async () => {
  const snapshot = await getDocs(mealColRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addMeal = async (meal: { name: string; description: string; image: string; date: string; favorite: boolean; userId: string; }) => {
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
