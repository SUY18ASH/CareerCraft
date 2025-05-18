import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import PageLayout from "../PageLayout";
import { NotificationContext } from "../../context/NotificationContext";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      showNotification("Login successful!", "success");
      navigate("/");
    } catch (err) {
      showNotification(err.response?.data?.message || "Login failed!", "error");
    }
  };

  return (
    <PageLayout title="Login">
      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              value={formData.password}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit">
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--accent-primary)",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
