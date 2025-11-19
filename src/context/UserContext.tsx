// import React, { createContext, useContext, useEffect, useState } from "react";

// type UserContextType = {
//   user: any;
//   loading: boolean;
//   error: string | null;
//   refetchUser: () => void;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUser = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/user");
//       if (!res.ok) throw new Error("Failed to load user");
//       const data = await res.json();
//       setUser(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading, error, refetchUser: fetchUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("useUser must be used within a UserProvider");
//   return context;
// };
