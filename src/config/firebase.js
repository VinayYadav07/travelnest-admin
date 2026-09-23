const FIREBASE_KEY = import.meta.env.VITE_FIREBASE_KEY;

const DATABASE_URL = "https://travel-project-2bce6-default-rtdb.firebaseio.com";

const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

// Admin login
const signInAdmin = async (email, password) => {
  if (!FIREBASE_KEY) {
    throw new Error("Firebase API key is missing.");
  }

  const response = await fetch(
    `${AUTH_URL}:signInWithPassword?key=${FIREBASE_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    },
  );

  const loginData = await response.json();

  if (!response.ok) {
    throw new Error(loginData.error?.message || "Login failed");
  }

  return loginData;
};

// Admin login information save karna
const saveAdminLogin = (loginData) => {
  localStorage.setItem("adminLoginToken", loginData.idToken);
  localStorage.setItem("adminUserId", loginData.localId);
  localStorage.setItem("adminEmail", loginData.email);

  localStorage.setItem(
    "adminName",
    loginData.displayName || loginData.email?.split("@")[0] || "Admin",
  );
};

// Admin logout
const logoutAdmin = () => {
  const loginData = [
    "adminLoginToken",
    "adminUserId",
    "adminEmail",
    "adminName",
  ];

  loginData.forEach((item) => {
    localStorage.removeItem(item);
  });
};

// Admin ka naam lena
const getAdminName = () => {
  return localStorage.getItem("adminName") || "Admin";
};

// Firebase authentication token lena
const getAuthToken = () => {
  const token = localStorage.getItem("adminLoginToken");

  if (!token) {
    return "";
  }

  return `?auth=${encodeURIComponent(token)}`;
};

// Firebase se data read karna
const readDB = async (path) => {
  const token = localStorage.getItem("adminLoginToken");

  if (!token) {
    throw new Error("Admin login token not found. Please login again.");
  }

  const url = `${DATABASE_URL}/${path}.json?auth=${encodeURIComponent(token)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.error("Firebase Read Error:", data);

    throw new Error(data?.error || `Could not read ${path}`);
  }

  return data;
};

// Firebase mein new data add karna
const pushDB = async (path, data) => {
  const url = `${DATABASE_URL}/${path}.json${getAuthToken()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Firebase Push Error:", result);

    throw new Error(result?.error || `Could not add data to ${path}`);
  }

  return result;
};

// Firebase mein data update karna
const patchDB = async (path, data) => {
  const url = `${DATABASE_URL}/${path}.json${getAuthToken()}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Firebase Patch Error:", result);

    throw new Error(result?.error || `Could not update ${path}`);
  }

  return result;
};

// Firebase se data delete karna
const removeDB = async (path) => {
  const url = `${DATABASE_URL}/${path}.json${getAuthToken()}`;

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();

    console.error("Firebase Delete Error:", result);

    throw new Error(result?.error || `Could not delete ${path}`);
  }

  return true;
};

// Firebase object ko array mein convert karna
const objToArr = (data) => {
  if (!data) {
    return [];
  }

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
};

// Backup listings
const FALLBACK_LISTINGS = [
  {
    id: "l1",
    name: "Azure Cliff Villa",
    category: "Villa",
    city: "Goa",
    pincode: "403004",
    price: 8500,
    available: true,
    description: "Beachside villa with pool.",
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
    ],
  },
  {
    id: "l2",
    name: "Backwater Houseboat",
    category: "Houseboat",
    city: "Alleppey",
    pincode: "688001",
    price: 5200,
    available: true,
    description: "Kerala houseboat.",
    images: [
      "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?w=800",
    ],
  },
  {
    id: "l3",
    name: "Studio Loft Downtown",
    category: "Apartment",
    city: "Mumbai",
    pincode: "400001",
    price: 3200,
    available: true,
    description: "Modern studio.",
    images: [
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?w=800",
    ],
  },
  {
    id: "l4",
    name: "Himalayan Cottage",
    category: "Cottage",
    city: "Manali",
    pincode: "175131",
    price: 4100,
    available: true,
    description: "Cosy cottage.",
    images: [
      "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?w=800",
    ],
  },
  {
    id: "l5",
    name: "Desert Camp Suite",
    category: "Camp",
    city: "Jaisalmer",
    pincode: "345001",
    price: 6800,
    available: true,
    description: "Thar desert camp.",
    images: [
      "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?w=800",
    ],
  },
  {
    id: "l6",
    name: "Heritage Haveli Suite",
    category: "Villa",
    city: "Udaipur",
    pincode: "313001",
    price: 9200,
    available: true,
    description: "Royal haveli.",
    images: [
      "https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg?w=800",
    ],
  },
];

// Backup categories
const FALLBACK_CATEGORIES = [
  {
    id: "c1",
    name: "Villa",
  },
  {
    id: "c2",
    name: "Houseboat",
  },
  {
    id: "c3",
    name: "Apartment",
  },
  {
    id: "c4",
    name: "Cottage",
  },
  {
    id: "c5",
    name: "Camp",
  },
];

// Backup bookings
const FALLBACK_BOOKINGS = [];

// Export all Firebase functions and backup data
export {
  signInAdmin,
  saveAdminLogin,
  logoutAdmin,
  getAdminName,
  readDB,
  pushDB,
  patchDB,
  removeDB,
  objToArr,
  FALLBACK_LISTINGS,
  FALLBACK_CATEGORIES,
  FALLBACK_BOOKINGS,
};
