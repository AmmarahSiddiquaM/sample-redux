import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

//Pages
import Home from "./pages/Home.js";
import Country from "./pages/Country.js";
import CountryView from "./pages/CountryView.js";
import City from "./pages/City.js";
import CityView from "./pages/CityView.js";
import Address from "./pages/Address.js";
import Actor from "./pages/Actor.js";
import ActorView from "./pages/ActorView.js";
import Advisor from "./pages/Advisor.js";
import AdvisorView from "./pages/AdvisorView.js";
import Investor from "./pages/Investor.js";
import InvestorView from "./pages/InvestorView.js";
import Category from "./pages/Category.js";
import CategoryView from "./pages/CategoryView.js";
import Language from "./pages/Language.js";
import LanguageView from "./pages/LanguageView.js";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";

//Components
import ProtectedRoute from "./components/ProtectedRoute.js";
import Menu from "./components/nav/Menu.js";
import GeoNav from "./components/nav/GeoNav.js";
import ActorNav from "./components/nav/ActorNav.js";

//Context
import { useAuth } from "./context/auth";

//CSS
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
          <Route
            path="country/:countryId"
            element={
              <ProtectedRoute>
                <CountryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="city"
            element={
              <ProtectedRoute>
                <City />
              </ProtectedRoute>
            }
          />
          <Route
            path="city/:cityId"
            element={
              <ProtectedRoute>
                <CityView />
              </ProtectedRoute>
            }
          />

          <Route
            path="address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/actor"
          element={
            <ProtectedRoute>
              <ActorNav />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Actor />
              </ProtectedRoute>
            }
          />
          <Route
            path="actor/:actorId"
            element={
              <ProtectedRoute>
                <ActorView />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <Advisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor/:advisorId"
          element={
            <ProtectedRoute>
              <AdvisorView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investor"
          element={
            <ProtectedRoute>
              <Investor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor/:investorId"
          element={
            <ProtectedRoute>
              <InvestorView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <ProtectedRoute>
              <CategoryView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/language"
          element={
            <ProtectedRoute>
              <Language />
            </ProtectedRoute>
          }
        />
        <Route
          path="/language/:languageId"
          element={
            <ProtectedRoute>
              <LanguageView />
            </ProtectedRoute>
          }
        />

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
