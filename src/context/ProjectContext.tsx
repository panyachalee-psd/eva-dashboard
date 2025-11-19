// import React, { createContext, useContext, useEffect, useState } from "react";

// type ProjectContextType = {
//   projects: any[];
//   loading: boolean;
//   error: string | null;
//   refetchProjects: () => void;
// };

// const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchProjects = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/projects");
//       if (!res.ok) throw new Error("Failed to load projects");
//       const data = await res.json();
//       setProjects(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <ProjectContext.Provider value={{ projects, loading, error, refetchProjects: fetchProjects }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProjects = () => {
//   const context = useContext(ProjectContext);
//   if (!context) throw new Error("useProjects must be used within a ProjectProvider");
//   return context;
// };
