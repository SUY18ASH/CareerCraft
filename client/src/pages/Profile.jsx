// src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Typography
} from "@mui/material";
import API from "../api";
import PageLayout from "../components/PageLayout";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=One",
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=Two",
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=Three",
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=Four",
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=Five",
  "https://api.dicebear.com/5.x/pixel-art/svg?seed=Six"
];

export default function Profile() {
  const { auth, login } = useContext(AuthContext);
  const showNotification = useContext(NotificationContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/auth/me")
      .then(res => setForm({
        name: res.data.name,
        email: res.data.email,
        password: "",
        avatar: res.data.avatar || ""
      }))
      .catch(() => showNotification("Failed to load profile", "error"));
  }, [showNotification]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePickAvatar = url => {
    setForm(f => ({ ...f, avatar: url }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.put("/auth/me", form);
      showNotification("Profile updated", "success");
      login(res.data.user, auth.token);
    } catch {
      showNotification("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout title="My Profile">
      <Card>
        <CardContent>
          {/* Avatar Picker */}
          <Typography variant="subtitle1" sx={{ mb: 1, color: "var(--accent-primary)" }}>
            Choose Avatar
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {AVATAR_OPTIONS.map(url => (
              <Grid item key={url}>
                <Box
                  onClick={() => handlePickAvatar(url)}
                  sx={{
                    width: 60, height: 60, p: 0.5, borderRadius: "50%",
                    border: form.avatar === url 
                      ? "3px solid var(--accent-secondary)" 
                      : "3px solid transparent",
                    cursor: "pointer",
                    transition: "border-color .2s"
                  }}
                >
                  <Avatar src={url} sx={{ width: 52, height: 52 }} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Profile Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{ background: "var(--card-bg)" }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{ background: "var(--card-bg)" }}
            />
            <TextField
              label="New Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              helperText="Leave blank to keep current"
              fullWidth
              sx={{ background: "var(--card-bg)" }}
            />
            <Box className="action-buttons">
              <Button
                variant="contained"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
