# 🍽️ Meal Mate - Complete Meal Planning & Management App

![Meal Mate Logo](./assets/images/MealMate.png)

## 📱 Overview

**Meal Mate** is a comprehensive React Native mobile application built with Expo that helps users plan, manage, and organize their meals efficiently. The app combines meal creation, planning, favorites management, and advanced camera functionality with QR code scanning capabilities.

---

## 🚀 Key Features

### 🔐 **Authentication System**

- **User Registration**: Create account with email and password
- **Secure Login**: Firebase Authentication integration
- **Profile Management**: Complete user profile with photo upload
- **Session Persistence**: Automatic login state management
- **Logout Functionality**: Secure session termination

### 🍽️ **Meal Management**

- **Create Meals**: Add detailed meal information with rich metadata
- **Edit Meals**: Update existing meal details and images
- **Delete Meals**: Remove meals with confirmation dialogs
- **View Meals**: Browse all created meals in organized layout
- **Real-time Sync**: Live updates across all devices

### 📊 **Meal Details**

- **Basic Information**: Title, name, description
- **Nutritional Data**: Calories, servings, cooking time
- **Ingredients**: Comma-separated ingredient lists
- **Categories**: Breakfast, lunch, dinner, snack classification
- **Images**: High-quality meal photography with cloud storage
- **Metadata**: Creation dates, user association, favorites status

### 📅 **Meal Planning System**

- **Weekly Calendar**: Interactive 7-day meal planning interface
- **Date Selection**: Plan meals for any future date
- **Meal Type Organization**: Separate breakfast, lunch, dinner, snack sections
- **Drag & Drop Planning**: Select from existing meals to plan
- **Confirmation Dialogs**: Verify meal planning actions
- **Visual Indicators**: Show planned vs. empty meal slots

### ❤️ **Favorites Management**

- **Toggle Favorites**: One-tap favorite/unfavorite meals
- **Real-time Updates**: Instant favorites synchronization using Firestore listeners
- **Dedicated Favorites Screen**: Browse all favorite meals
- **Visual Indicators**: Heart icons showing favorite status
- **Persistent Storage**: Favorites saved across sessions

### 📸 **Advanced Camera System**

- **Photo Capture**: High-quality meal photography
- **Front/Back Camera**: Toggle between camera modes
- **Gallery Integration**: Select existing photos from device
- **Auto-save to Gallery**: Photos automatically saved to device
- **Direct Integration**: Camera photos flow into meal creation
- **Permission Management**: Proper camera and media permissions

### 📱 **QR Code Scanner**

- **Real-time Scanning**: Instant QR code detection
- **Visual Feedback**: Scanning frame with corner indicators
- **URL Detection**: Automatic web URL identification and opening
- **Error Handling**: Graceful handling of invalid QR codes
- **Mode Switching**: Toggle between camera and scanner modes

### 🎨 **Theme System**

- **Dark/Light Mode**: Complete theme switching
- **System Integration**: Follow device theme preferences
- **Persistent Settings**: Theme choice saved using AsyncStorage
- **Comprehensive Colors**: Full color palette for all UI elements
- **Real-time Switching**: Instant theme changes without app restart

### 👤 **User Profile Management**

- **Profile Creation**: Complete user profile setup during registration
- **Profile Editing**: Update display name, email, profile image
- **Image Upload**: Profile photo management with Cloudinary
- **Account Settings**: Comprehensive user account management
- **Data Persistence**: Profile data stored in Firestore

### 🏠 **Dashboard & Navigation**

- **Home Screen**: Quick overview with recent meals and statistics
- **Bottom Tab Navigation**: Easy access to all major sections
- **Quick Actions**: Fast access to common tasks
- **Statistics Display**: Meal counts, planning overview
- **Recent Activity**: Latest meals and planning activities

---

## 🛠️ Technical Implementation

### **Frontend Architecture**

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **Navigation**: Expo Router with file-based routing
- **Styling**: NativeWind (Tailwind CSS) + inline styles
- **Icons**: Material Icons from @expo/vector-icons
- **State Management**: React Context API with hooks

### **Backend & Database**

- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Real-time Updates**: Firestore onSnapshot listeners
- **Image Storage**: Cloudinary cloud storage
- **Data Structure**: Optimized collections with proper indexing

### **Key Technologies**

```json
{
  "expo": "~53.0.20",
  "react": "19.0.0",
  "react-native": "0.79.5",
  "expo-camera": "^17.0.6",
  "expo-barcode-scanner": "^13.0.1",
  "firebase": "^12.2.1",
  "typescript": "~5.8.3"
}
```

### **Camera & Media**

- **Camera API**: expo-camera with CameraView
- **Image Picker**: expo-image-picker for gallery access
- **Media Library**: expo-media-library for photo saving
- **Barcode Scanning**: expo-barcode-scanner for QR codes
- **Permissions**: Proper runtime permission handling

---

## 📁 Project Structure

```
📦 Meal Mate/
├── 📁 app/                          # Expo Router app directory
│   ├── 📁 (auth)/                   # Authentication screens
│   │   ├── login.tsx                # Login screen
│   │   ├── register.tsx             # Registration screen
│   │   └── _layout.tsx              # Auth layout
│   ├── 📁 (dashboard)/              # Main app screens
│   │   ├── 📁 meals/                # Meal management
│   │   │   ├── [id].tsx             # Meal creation/editing form
│   │   │   ├── index.tsx            # Meals list screen
│   │   │   └── _layout.tsx          # Meals layout
│   │   ├── camera.tsx               # Camera & QR scanner
│   │   ├── favourites.tsx           # Favorites management
│   │   ├── home.tsx                 # Dashboard home
│   │   ├── plan.tsx                 # Meal planning calendar
│   │   ├── profile.tsx              # User profile
│   │   └── _layout.tsx              # Main app layout
│   ├── index.tsx                    # App entry point
│   └── _layout.tsx                  # Root layout
├── 📁 components/                   # Reusable UI components
│   ├── CameraAccessButton.tsx       # Camera access component
│   ├── FooterNav.tsx                # Navigation footer
│   ├── Loader.tsx                   # Loading indicator
│   ├── MealCard.tsx                 # Meal display card
│   └── QRCodeShare.tsx              # QR code sharing
├── 📁 context/                      # React Context providers
│   ├── AuthContext.tsx              # Authentication state
│   ├── LoaderContext.tsx            # Loading state
│   └── ThemeContext.tsx             # Theme management
├── 📁 services/                     # API & business logic
│   ├── authService.ts               # Authentication services
│   ├── mealService.ts               # Meal CRUD operations
│   └── userService.ts               # User profile services
├── 📁 types/                        # TypeScript definitions
│   ├── meal.ts                      # Meal data types
│   └── user.ts                      # User data types
└── 📁 assets/                       # Static resources
    ├── 📁 images/                   # App images & icons
    └── 📁 fonts/                    # Custom fonts
```

---

## 🔧 Core Functions & APIs

### **Authentication Services**

```typescript
// User authentication and session management
export const login = (email: string, password: string)
export const logout = ()
export const createUserWithEmailAndPassword()
export const signInWithEmailAndPassword()
```

### **Meal Services**

```typescript
// Complete meal management system
export const createMeal = async (meal: Meal)
export const getMeals = async (userId: string)
export const getMealById = async (id: string)
export const updateMeal = async (id: string, meal: Partial<Meal>)
export const deleteMeal = async (id: string)
export const getPlannedMeals = async (userId: string, startDate?: string, endDate?: string)
export const getMealsByTypeAndDate = async (userId: string, date: string, mealType: string)
export const toggleMealFavorite = async (mealId: string)
export const getFavoriteMeals = async (userId: string)
export const ensureFavoriteField = async (userId: string)
```

### **User Profile Services**

```typescript
// User profile and data management
export const createUserProfile = async (userProfile: UserProfile)
export const getUserProfile = async (userId: string)
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>)
export const createOrUpdateUserProfile = async (userProfile: UserProfile)
```

### **Image & Media Services**

```typescript
// Image upload and management
export const uploadImageToCloudinary = async (imageUri: string)
export const pickImage = async ()
export const takePicture = async ()
export const saveToLibrary = async (uri: string)
```

---

## 📱 Screen Functionality

### **🏠 Home Dashboard**

- **Welcome Message**: Personalized greeting with user profile
- **Quick Actions**: Fast access to common tasks (Add Meal, Plan Meals, Camera, Favorites)
- **Today's Meals**: Overview of meals planned for current day
- **Recent Meals**: Latest created meals with quick actions
- **Statistics**: Meal counts and planning overview
- **Theme Toggle**: Dark/light mode switcher

### **🍽️ Meals Management**

- **Meals List**: Grid/list view of all user meals
- **Add New Meal**: Floating action button for quick meal creation
- **Real-time Updates**: Live meal list updates using Firestore listeners
- **Favorite Toggle**: One-tap favorite management
- **Delete Confirmation**: Safe meal deletion with confirmation

### **📝 Meal Creation/Editing Form**

- **Rich Form Fields**: Title, name, description, ingredients
- **Nutritional Information**: Calories, servings, cooking time
- **Meal Type Selection**: Breakfast, lunch, dinner, snack buttons
- **Image Management**: Gallery picker + camera integration
- **Schedule Meal**: Option to directly schedule meal during creation
- **Form Validation**: Required field validation and error handling

### **📅 Meal Planning Calendar**

- **Weekly View**: Interactive 7-day calendar
- **Date Navigation**: Scroll through different weeks
- **Meal Type Sections**: Organized breakfast, lunch, dinner, snack sections
- **Drag & Drop Interface**: Select meals from library to plan
- **Visual Indicators**: Show planned vs. empty meal slots
- **Confirmation Dialogs**: Verify meal planning actions

### **❤️ Favorites Screen**

- **Real-time Favorites**: Live updates using onSnapshot listeners
- **Filter Options**: Show only favorite meals
- **Quick Actions**: Unfavorite, plan, or edit favorite meals
- **Empty State**: Helpful message when no favorites exist

### **📸 Camera Interface**

- **Professional UI**: Native camera controls with intuitive design
- **Mode Switching**: Camera/QR scanner toggle
- **Camera Controls**: Capture, flip, gallery access
- **QR Scanner**: Real-time QR code detection with visual frame
- **Permission Handling**: Proper camera and media library permissions
- **Error Management**: Graceful error handling and user feedback

### **👤 Profile Management**

- **Profile Display**: User information with profile photo
- **Edit Profile**: Update name, email, profile image
- **Image Upload**: Profile photo management via camera/gallery
- **Account Settings**: Theme preferences and app settings
- **Logout**: Secure session termination

---

## 🎯 Data Models

### **Meal Model**

```typescript
interface Meal {
  id?: string;
  title: string;
  name: string;
  description?: string;
  image?: string;
  userId: string;
  favorite: boolean;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  plannedDate?: string;
  ingredients?: string[];
  cookingTime?: number;
  servings?: number;
  calories?: number;
  isPlanned?: boolean;
}
```

### **User Profile Model**

```typescript
interface UserProfile {
  id?: string;
  userId: string;
  displayName?: string;
  email?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
  };
}
```

---

## 🔐 Security & Permissions

### **Firebase Security Rules**

- User-based data isolation
- Authenticated read/write operations
- Field-level validation
- Rate limiting protection

### **App Permissions**

- **Camera**: Required for photo capture and QR scanning
- **Media Library**: Needed for photo saving and gallery access
- **Internet**: Required for Firebase and Cloudinary operations
- **Storage**: Local storage for theme preferences

---

## 📋 Installation & Setup

### **Prerequisites**

```bash
Node.js >= 18.0.0
npm or yarn
Expo CLI
iOS Simulator / Android Emulator (optional)
```

### **Installation Steps**

```bash
# Clone repository
git clone https://github.com/YourUsername/meal-mate.git

# Navigate to project directory
cd meal-mate

# Install dependencies
npm install

# Start development server
npx expo start
```

### **Environment Configuration**

Create a `firebase.ts` file with your Firebase configuration:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## 🚀 Performance Optimizations

### **Data Management**

- **Real-time Updates**: Firestore onSnapshot for live data
- **Optimistic Updates**: Immediate UI feedback
- **Image Optimization**: Cloudinary automatic optimization
- **Caching**: AsyncStorage for offline theme preferences
- **Lazy Loading**: Efficient component rendering

### **Memory Management**

- **Image Compression**: 0.8 quality for performance balance
- **Component Cleanup**: Proper useEffect cleanup
- **Memory Leaks Prevention**: Unsubscribe from listeners
- **Efficient Queries**: Optimized Firestore queries

---

## 🔄 Development Workflow

### **Development Commands**

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

---

## 📱 Platform Support

### **Supported Platforms**

- ✅ **iOS**: iPhone and iPad support
- ✅ **Android**: Phone and tablet support
- ✅ **Web**: Progressive Web App capabilities
- 📱 **Expo Go**: Development testing on physical devices

### **Device Requirements**

- **iOS**: iOS 13.0 or later
- **Android**: Android 6.0 (API level 23) or later
- **Camera**: Required for photo capture and QR scanning
- **Internet**: Required for Firebase synchronization

---

## 🏆 Key Achievements

✅ **Complete Meal Management System**  
✅ **Advanced Camera & QR Code Integration**  
✅ **Real-time Synchronization**  
✅ **Modern UI with Theme Support**  
✅ **Comprehensive User Authentication**  
✅ **Cloud-based Image Storage**  
✅ **Cross-platform Compatibility**  
✅ **Type-safe Development**

---

**Made with ❤️ using React Native, Expo, and Firebase**
