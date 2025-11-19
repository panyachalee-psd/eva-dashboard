import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // any PrimeReact theme you like
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; // <-- this is the icon CSS
import "./i18n.ts"; // load i18n config once

// createRoot(document.getElementById("root")!).render(<App />);
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
