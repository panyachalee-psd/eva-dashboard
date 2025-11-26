// src/components/Loading.tsx
import { ProgressSpinner } from "primereact/progressspinner";

export default function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        color: "#4b5563",
      }}
    >
      <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
      <p>Loading...</p>
    </div>
  );
}
