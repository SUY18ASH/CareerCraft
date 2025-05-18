import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Box,
  Alert,
} from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function JobRecommendations() {
  const [jobs, setJobs] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [coverText, setCoverText] = useState("");
  const [generatingId, setGeneratingId] = useState(null);
  const showNotification = useContext(NotificationContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const MotionButton = motion(Button);
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const recs = JSON.parse(localStorage.getItem("recommendedJobs") || "[]");
    setJobs(recs);
  }, []);

  useEffect(() => {
    API.get("/bookmarks")
      .then((res) => setBookmarkedIds(res.data.map((j) => j._id)))
      .catch(() => {});
  }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post("/applications/apply", { jobId });
      showNotification("Applied successfully", "success");
    } catch (err) {
      showNotification(err.response?.data?.message || "Apply failed", "error");
    }
  };

  const handleATS = async (jobId) => {
    const resumeText = localStorage.getItem("extractedText") || "";
    try {
      const res = await API.post("/ats/score", { jobId, resumeText });
      const { score, matched } = res.data;
      showNotification(
        `ATS Score: ${score}% (matched: ${matched.join(", ")})`,
        "info"
      );
    } catch {
      showNotification("ATS scoring failed", "error");
    }
  };

  const toggleBookmark = async (jobId) => {
    try {
      const isBookmarked = bookmarkedIds.includes(jobId);
      const url = isBookmarked ? "/bookmarks/remove" : "/bookmarks/add";
      await API.post(url, { jobId });
      setBookmarkedIds((ids) =>
        isBookmarked ? ids.filter((id) => id !== jobId) : [...ids, jobId]
      );
      showNotification(
        isBookmarked ? "Removed bookmark" : "Bookmarked job",
        "success"
      );
    } catch {
      showNotification("Bookmark action failed", "error");
    }
  };

  const handleGenerateCover = async (job) => {
    setGeneratingId(job._id);
    try {
      const profile = {
        name: auth.user.name,
        skills: JSON.parse(localStorage.getItem("extractedSkills") || "[]"),
      };
      const resumeText = localStorage.getItem("extractedText") || "";
      const res = await API.post("/cover/generate", {
        jobId: job._id,
        resumeText,
        profile,
      });
      setCoverText(res.data.coverLetter);
      setCoverModalOpen(true);
    } catch {
      showNotification("Cover letter generation failed", "error");
    } finally {
      setGeneratingId(null);
    }
  };

  if (jobs === null) {
    return (
      <PageLayout title="Job Recommendations">
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography>Loading recommendations…</Typography>
        </Box>
      </PageLayout>
    );
  }

  if (jobs.length === 0) {
    return (
      <PageLayout title="Job Recommendations">
        <Alert severity="info" sx={{ mb: 2 }}>
          No recommendations found. Please analyze your resume first.
        </Alert>
        <Box className="action-buttons">
          <Button variant="contained" onClick={() => navigate("/analysis")}>
            Go to Analysis
          </Button>
          <Button variant="outlined" onClick={() => navigate("/upload")}>
            Upload Resume
          </Button>
        </Box>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout title="Job Recommendations">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} md={4} key={job._id}>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {job.company} — {job.location}
                      </Typography>
                      <Typography sx={{ my: 1 }} variant="body2">
                        {job.description}
                      </Typography>
                      <Typography variant="caption">
                        Skills: {job.skills.join(", ")}
                      </Typography>

                      <Box className="action-buttons" sx={{ mt: "auto" }}>
                        <MotionButton
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          onClick={() => handleApply(job._id)}
                          variant="contained"
                        >
                          Apply
                        </MotionButton>
                        <Button
                          onClick={() => handleATS(job._id)}
                          variant="outlined"
                        >
                          ATS Score
                        </Button>
                        <Button
                          onClick={() => handleGenerateCover(job)}
                          variant="outlined"
                          disabled={generatingId === job._id}
                        >
                          {generatingId === job._id
                            ? "Generating…"
                            : "Cover Letter"}
                        </Button>
                        <IconButton onClick={() => toggleBookmark(job._id)}>
                          {bookmarkedIds.includes(job._id) ? (
                            <Bookmark />
                          ) : (
                            <BookmarkBorder />
                          )}
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </PageLayout>

      {/* Cover Letter Modal */}
      <Dialog
        open={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Draft Cover Letter</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            minRows={10}
            style={{ width: "100%" }}
            value={coverText}
            readOnly
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCoverModalOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              const blob = new Blob([coverText], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "CoverLetter.txt";
              a.click();
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
