import { BrowserRouter } from "react-router-dom";

import Menu from "./components/Menu";
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Menu />
        <div>
          <AppRouter />
        </div>
      </div>
    </BrowserRouter>
  );
}
