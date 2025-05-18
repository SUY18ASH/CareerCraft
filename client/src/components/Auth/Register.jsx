import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";
import PageLayout from "../PageLayout";
import { NotificationContext } from "../../context/NotificationContext";
import API from "../../api";

export default function Register() {
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      showNotification("Registered successfully!", "success");
      navigate("/login");
    } catch (err) {
      showNotification(err.response?.data?.message || "Registration failed!", "error");
    }
  };

  return (
    <PageLayout title="Register">
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              required
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
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
              helperText="At least 6 characters"
            />
            <Button variant="contained" type="submit">
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
