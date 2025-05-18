import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import API from "../api";
import { NotificationContext } from "../context/NotificationContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function AdminJobPost() {
  const showNotification = useContext(NotificationContext);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const MotionButton = motion(Button);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!form.title || !form.company || skillsArray.length === 0) {
      return showNotification(
        "Please fill title, company and at least one skill",
        "warning"
      );
    }
    try {
      setLoading(true);
      await API.post("/jobs/add", {
        title: form.title,
        company: form.company,
        description: form.description,
        location: form.location,
        skills: skillsArray,
      });
      showNotification("Job posted successfully!", "success");
      setForm({
        title: "",
        company: "",
        description: "",
        location: "",
        skills: "",
      });
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || "Failed to post job",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Post a New Job">
      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Job Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Skills (comma-separated)"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              helperText="e.g. React, Node.js, MongoDB"
              required
              fullWidth
            />
            <Box className="action-buttons">
              <MotionButton
                type="submit"
                variant="contained"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Posting…" : "Post Job"}
              </MotionButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
