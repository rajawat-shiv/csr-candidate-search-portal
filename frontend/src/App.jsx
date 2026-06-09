import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import SearchPage from "./pages/SearchPage";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<SearchPage />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;