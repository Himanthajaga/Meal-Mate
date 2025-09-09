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

import { Meal } from "@/types/meal";

export const mealColRef = collection(db, "meals");

export const createMeal = async (meal: Meal) => {
  let imageUrl = meal.image;
  if (imageUrl && imageUrl.startsWith("file://")) {
    imageUrl = await uploadImageToCloudinary(imageUrl);
  }
  const docRef = await addDoc(mealColRef, { ...meal, image: imageUrl });
  return docRef.id;
};

export const uploadImageToCloudinary = async (imageUri: string) => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);
  data.append("upload_preset", "my_preset"); // Replace with your preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload",
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  return result.secure_url;
};

export const getMeals = async (userId: string) => {
  const q = query(mealColRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Meal) }));
};

export const getMealById = async (id: string) => {
  const docRef = doc(db, "meals", id);
  const mealSnap = await getDoc(docRef);
  if (mealSnap.exists()) {
    return { id: mealSnap.id, ...mealSnap.data() };
  }
  return null;
};

export const updateMeal = async (id: string, meal: Partial<Meal>) => {
  const docRef = doc(db, "meals", id);
  await updateDoc(docRef, meal);
};

export const deleteMeal = async (id: string) => {
  const docRef = doc(db, "meals", id);
  await deleteDoc(docRef);
};

export const fetchMockRecipes = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
  );
  const data = await res.json();
  return data.meals;
};
