// import React, { createContext, useContext, useEffect, useState } from "react";

// type DataContextType = {
//   user: any;
//   projects: any[];
//   notifications: any[];
//   loading: boolean;
//   error: string | null;
//   refetchAll: () => void;
//   refetchUser: () => void;
//   refetchProjects: () => void;
//   refetchNotifications: () => void;
// };

// const DataContext = createContext<DataContextType | undefined>(undefined);

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any>(null);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Fetch user
//   const fetchUser = async () => {
//     try {
//       const res = await fetch("/api/user");
//       const data = await res.json();
//       setUser(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // 🔹 Fetch projects
//   const fetchProjects = async () => {
//     try {
//       const res = await fetch("/api/projects");
//       const data = await res.json();
//       setProjects(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // 🔹 Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch("/api/notifications");
//       const data = await res.json();
//       setNotifications(data);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // 🔹 Fetch all together
//   const refetchAll = async () => {
//     setLoading(true);
//     setError(null);
//     await Promise.all([fetchUser(), fetchProjects(), fetchNotifications()]);
//     setLoading(false);
//   };

//   // Fetch once when mounted
//   useEffect(() => {
//     refetchAll();
//   }, []);

//   return (
//     <DataContext.Provider
//       value={{
//         user,
//         projects,
//         notifications,
//         loading,
//         error,
//         refetchAll,
//         refetchUser: fetchUser,
//         refetchProjects: fetchProjects,
//         refetchNotifications: fetchNotifications,
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };

// // 🔹 Custom hook
// export const useData = () => {
//   const context = useContext(DataContext);
//   if (!context) throw new Error("useData must be used within a DataProvider");
//   return context;
// };
