import React, { useState, useContext } from "react";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { NotificationContext } from "../context/NotificationContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const showNotification = useContext(NotificationContext);
  const navigate = useNavigate();
  const MotionButton = motion(Button);

  const handleUpload = async () => {
    if (!file) {
      return showNotification("Select a resume file.", "error");
    }
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setUploading(true);
      const res = await API.post("/resume/upload", formData);
      localStorage.setItem("extractedText", res.data.extractedText);
      showNotification("Resume uploaded and parsed!", "success");
      navigate("/analysis");
    } catch {
      showNotification("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout title="Upload Your Resume">
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <MotionButton
            variant="contained"
            component="label"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </MotionButton>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {file?.name || "No file chosen"}
          </Typography>
          <div className="action-buttons">
            <MotionButton
              variant="contained"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleUpload}
              disabled={uploading}
              startIcon={uploading && <CircularProgress size={20} />}
            >
              {uploading ? "Uploading…" : "Upload & Analyze"}
            </MotionButton>
            <Button
              variant="outlined"
              component="a"
              href="/sample-resume.pdf"
              target="_blank"
            >
              Download Sample
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
