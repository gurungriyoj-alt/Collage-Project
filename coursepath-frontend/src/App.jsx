import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoadmapDetail from "./pages/RoadmapDetail";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/roadmap/:id" element={<RoadmapDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
