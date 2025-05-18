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
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const showNotification = useContext(NotificationContext);
  const { auth } = useContext(AuthContext);
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    API.get("/applications")
      .then((res) => setApps(res.data))
      .catch(() => showNotification("Failed to load applications", "error"));
  }, [showNotification]);

  return (
    <PageLayout title="My Applications">
      {apps.length === 0 ? (
        <Typography>No applications yet.</Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {apps.map((app) => (
              <Grid item xs={12} md={6} key={app._id}>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{app.job.title}</Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {app.job.company} — {app.job.location}
                      </Typography>
                      <Typography>Status: {app.status}</Typography>
                      <Typography variant="caption">
                        Applied on{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                      <Box className="action-buttons" sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() =>
                            window.open(app.job.link || "#", "_blank")
                          }
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
