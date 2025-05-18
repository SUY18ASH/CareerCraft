import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import StudentDashboard from "./components/Student/StudentDashboard";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import JobRecommendations from "./pages/JobRecommendations";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminJobPost from "./pages/AdminJobPost";
import Applications from "./pages/Applications";
import BookmarkedJobs from "./pages/BookmarkedJobs";
import Profile from "./pages/Profile";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <ResumeAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobRecommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <AdminJobPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarkedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Analytics />
      <SpeedInsights/>
    </>
  );
}

export default App;
