import { db, storage } from "../firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Meal } from "@/types/meal";

export const mealColRef = collection(db, "meals");

export const createMeal = async (meal: Meal) => {
  let imageUrl = meal.image;
  // If image is a local URI or base64, upload to Firebase Storage
  if (
    imageUrl &&
    (imageUrl.startsWith("file://") || imageUrl.startsWith("data:image"))
  ) {
    try {
      let blob: Blob | undefined;
      if (imageUrl.startsWith("file://")) {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else if (imageUrl.startsWith("data:image")) {
        // Convert base64 to blob
        const base64 = imageUrl.split(",")[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/jpeg" });
      }
      if (blob) {
        const filename = `meals/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } else {
        imageUrl = "";
      }
    } catch (err) {
      console.error("Image upload error:", err);
      imageUrl = "";
    }
  }
  const docRef = await addDoc(mealColRef, { ...meal, image: imageUrl });
  return docRef.id;
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
