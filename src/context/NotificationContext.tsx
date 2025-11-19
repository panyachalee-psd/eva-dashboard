// import React, { createContext, useContext, useEffect, useState } from "react";

// type NotificationContextType = {
//   notifications: any[];
//   loading: boolean;
//   error: string | null;
//   refetchNotifications: () => void;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/notifications");
//       if (!res.ok) throw new Error("Failed to load notifications");
//       const data = await res.json();
//       setNotifications(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ notifications, loading, error, refetchNotifications: fetchNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
//   return context;
// };
