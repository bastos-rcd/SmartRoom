import { BrowserRouter } from "react-router-dom";

import Menu from "./components/Menu";
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Menu />

        <div className="content">
          <AppRouter />
        </div>
      </div>
    </BrowserRouter>
  );
}
