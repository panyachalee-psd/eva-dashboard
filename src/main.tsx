
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import 'primereact/resources/themes/lara-light-blue/theme.css'; // any PrimeReact theme you like
  import 'primereact/resources/primereact.min.css';
  import 'primeicons/primeicons.css'; // <-- this is the icon CSS

  createRoot(document.getElementById("root")!).render(<App />);
  