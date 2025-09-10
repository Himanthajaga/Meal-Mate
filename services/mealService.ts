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
  // Ensure favorite field is set to false by default
  const mealData = {
    ...meal,
    image: imageUrl,
    favorite: meal.favorite || false,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(mealColRef, mealData);
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

// Get planned meals for a specific date range
export const getPlannedMeals = async (
  userId: string,
  startDate?: string,
  endDate?: string
) => {
  const q = query(
    mealColRef,
    where("userId", "==", userId),
    where("isPlanned", "==", true)
  );
  const snapshot = await getDocs(q);
  let meals = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Meal),
  }));

  // Filter by date range if provided
  if (startDate && endDate) {
    meals = meals.filter((meal) => {
      if (!meal.plannedDate) return false;
      const mealDate = meal.plannedDate.split("T")[0];
      return mealDate >= startDate && mealDate <= endDate;
    });
  }

  return meals;
};

// Get meals by meal type for a specific date
export const getMealsByTypeAndDate = async (
  userId: string,
  mealType: string,
  date: string
) => {
  const q = query(
    mealColRef,
    where("userId", "==", userId),
    where("mealType", "==", mealType),
    where("plannedDate", ">=", date + "T00:00:00.000Z"),
    where("plannedDate", "<=", date + "T23:59:59.999Z")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Meal) }));
};

// Toggle favorite status of a meal
export const toggleMealFavorite = async (mealId: string) => {
  console.log("Toggling favorite for meal ID:", mealId);
  const mealDocRef = doc(db, "meals", mealId);
  const mealDoc = await getDoc(mealDocRef);

  if (mealDoc.exists()) {
    const mealData = mealDoc.data();
    const currentFavorite = mealData.favorite || false;
    const newFavoriteStatus = !currentFavorite;

    console.log("Current favorite status:", currentFavorite);
    console.log("Setting favorite to:", newFavoriteStatus);

    await updateDoc(mealDocRef, { favorite: newFavoriteStatus });

    console.log("Successfully updated favorite status");
    return newFavoriteStatus;
  } else {
    console.log("Meal document not found for ID:", mealId);
  }
  return false;
};

// Get favorite meals for a user
export const getFavoriteMeals = async (userId: string) => {
  const q = query(
    mealColRef,
    where("userId", "==", userId),
    where("favorite", "==", true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Meal) }));
};

// Migration function to ensure all meals have a favorite field
export const ensureFavoriteField = async (userId: string) => {
  console.log("Checking and updating meals without favorite field...");
  const q = query(mealColRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const updatePromises = snapshot.docs.map(async (docRef) => {
    const data = docRef.data();
    if (data.favorite === undefined) {
      console.log("Updating meal without favorite field:", docRef.id);
      await updateDoc(doc(db, "meals", docRef.id), { favorite: false });
    }
  });

  await Promise.all(updatePromises);
  console.log("Finished updating meals with favorite field");
};
