import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Components
import AuthForm from "./AuthForm";
import Homepage from "./HomePage";
import CreateForm from "./CreateForm";
import PageDetails from "./PageDetails";

function App() {
  // State to manage logged-in user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth listener to check login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once auth state is known
    });

    // Cleanup the listener on component unmount
    return unsubscribe;
  }, []);

  // Show full screen loader while checking auth state
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<AuthForm />} />

      {/* Protected Routes */}
      <Route
        path="/homepage"
        element={user ? <Homepage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/create-form"
        element={user ? <CreateForm /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/page-details"
        element={user ? <PageDetails /> : <Navigate to="/login" replace />}
      />

      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
