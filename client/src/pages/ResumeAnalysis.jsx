import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import ResumeGenerator from "../components/ResumeGenerator";
import { AuthContext } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const showNotification = useContext(NotificationContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const MotionButton = motion(Button);

  useEffect(() => {
    const text = localStorage.getItem("extractedText");
    if (!text || !auth?.user) {
      // showNotification('Please upload resume and login first', 'error');
      setLoading(false);
      return;
    }
    API.post("/resume/analyze", { text })
      .then((res) => {
        setAnalysis(res.data.analysis);
        localStorage.setItem(
          "extractedSkills",
          JSON.stringify(res.data.analysis.skills)
        );
      })
      .catch(() => showNotification("Resume analysis failed", "error"))
      .finally(() => setLoading(false));
  }, [showNotification, auth]);

  const handleRecommend = () => {
    setRecommending(true);
    API.post("/jobs/recommend", { skills: analysis.skills })
      .then((res) => {
        localStorage.setItem(
          "recommendedJobs",
          JSON.stringify(res.data.recommendedJobs)
        );
        navigate("/jobs");
      })
      .catch(() => showNotification("Failed to fetch recommendations", "error"))
      .finally(() => setRecommending(false));
  };

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Analyzing resume…</Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!analysis) {
    return (
      <PageLayout title="Resume Analysis">
        <Alert severity="info" sx={{ mb: 2 }}>
          No resume found. Please upload your resume to analyze.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/upload")}>
          Go to Upload
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Resume Analysis Results">
      <Card>
        <CardContent>
          {/* Skills */}
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ mb: 3 }}>
            {analysis.skills.length ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {analysis.skills.map((s, i) => (
                  <Chip key={i} label={s} />
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">No skills found.</Typography>
            )}
          </Box>

          {/* Education & Experience */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Education</Typography>
              {analysis.education.length ? (
                <ul>
                  {analysis.education.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : (
                <Typography color="textSecondary">
                  No education info.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Experience</Typography>
              {analysis.experience.length ? (
                <ul>
                  {analysis.experience.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : (
                <Typography color="textSecondary">
                  No experience info.
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* PDF Download */}
          <div className="action-buttons" style={{ marginBottom: "1.5rem" }}>
            <ResumeGenerator
              buttonLabel="Download CV"
              profile={{ name: auth.user.name, email: auth.user.email }}
              skills={analysis.skills}
              education={analysis.education}
              experience={analysis.experience}
            />
          </div>

          {/* Recommend Button */}
          <MotionButton
            variant="contained"
            onClick={handleRecommend}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            disabled={recommending || !analysis.skills.length}
            startIcon={recommending && <CircularProgress size={20} />}
          >
            {recommending ? "Fetching Jobs…" : "Get Job Recommendations"}
          </MotionButton>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
