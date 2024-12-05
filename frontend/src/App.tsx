import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Users from "@/pages/Users";
import Products from "@/pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/context/index";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute component={Users} />} />
          <Route
            path="/products"
            element={<ProtectedRoute component={Products} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
