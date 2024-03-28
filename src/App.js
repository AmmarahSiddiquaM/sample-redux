import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

//Pages Imports
import Home from "./pages/Home.js";
import Country from "./pages/Country.js";
import CountryView from "./pages/CountryView.js";
import City from "./pages/City.js";
import Address from "./pages/Address.js";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";

//Components
import ProtectedRoute from "./components/ProtectedRoute.js";

//Component Imports
import Menu from "./components/nav/Menu.js";
import GeoNav from "./components/nav/GeoNav.js";

//Context
import { useAuth } from "./context/auth";

//CSS Imports
import "./App.css";

function App() {
  // context
  const [auth, setAuth] = useAuth();

  // axios config
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.token;

  return (
    <BrowserRouter>
      <Menu />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/geo"
          element={
            <ProtectedRoute>
              <GeoNav />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Country />
              </ProtectedRoute>
            }
          />
          <Route path="country/:countryId" element={<CountryView />} />
          <Route path="city" element={<City />} />
          <Route path="address" element={<Address />} />
        </Route>
        <Route
          path="*"
          element={
            <div>
              <h1>Page not found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
