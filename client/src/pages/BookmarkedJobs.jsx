import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import API from "../api";
import { NotificationContext } from "../context/NotificationContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function BookmarkedJobs() {
  const [jobs, setJobs] = useState([]);
  const showNotification = useContext(NotificationContext);
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    API.get("/bookmarks")
      .then((res) => setJobs(res.data))
      .catch(() => showNotification("Failed to load bookmarks", "error"));
  }, [showNotification]);

  return (
    <PageLayout title="Bookmarked Jobs">
      {jobs.length === 0 ? (
        <Typography>No bookmarks yet.</Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
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
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--text-secondary)" }}
                      >
                        {job.company}
                      </Typography>
                      <Box className="action-buttons" sx={{ mt: "auto" }}>
                        <Button
                          variant="contained"
                          onClick={() => window.open(job.link || "#", "_blank")}
                        >
                          View Job
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </PageLayout>
  );
}
