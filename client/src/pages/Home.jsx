// src/pages/Home.jsx
import React from "react";
import { Button as MuiButton, Container, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
const MotionButton = motion(MuiButton);

export default function Home() {
  return (
    <>
      {/* HERO */}
      <Box className="hero">
        <Typography variant="h1" component="h1">
          <motion.h1
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ yoyo: Infinity, duration: 2, ease: "easeInOut" }}
          >
            CareerCraft
          </motion.h1>
        </Typography>
        <Typography variant="h6" component="p">
          Your AI-powered companion for smarter job applications
        </Typography>
        <MotionButton
          component={MotionLink}
          to="/upload"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Get Started
        </MotionButton>
      </Box>

      {/* FEATURES */}
      <Box className="features">
        <Container className="feature-grid">
          {[
            [
              "📄 Resume Parser",
              "Auto-extract your skills, experience, and education.",
            ],
            [
              "🎯 Smart Matching",
              "AI matches you to relevant jobs in seconds.",
            ],
            ["📝 Cover Letters", "Generate tailored letters instantly."],
            ["📊 ATS Scoring", "See how your resume performs in real systems."],
          ].map(([title, desc], i) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box key={i} className="feature-card">
                <Typography variant="h3" component="h3">
                  {title}
                </Typography>
                <Typography component="p">{desc}</Typography>
              </Box>
            </motion.div>
          ))}
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box className="steps">
        <Container className="step-grid">
          {[
            ["1️⃣", "Upload Resume"],
            ["2️⃣", "Analyze Skills"],
            ["3️⃣", "Get Job Matches"],
            ["4️⃣", "Track & Apply"],
          ].map(([icon, label], i) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box key={i} className="step">
                <Box className="step-icon">{icon}</Box>
                <Typography variant="h6" className="step-title">
                  {label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box className="testimonials">
        <Typography variant="h4" component="h2">
          What Students Say
        </Typography>
        <Container className="testimonial-grid">
          {[
            "“CareerCraft helped me land my first internship in weeks!” — Aditi",
            "“Loved how easy the platform was to use; I applied to five jobs in ten minutes.” — Raj",
            "“Resume scoring and cover letters are a game-changer. Truly magical.” — Neha",
          ].map((text, i) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box key={i} className="testimonial">
                <Typography component="p">{text}</Typography>
              </Box>
            </motion.div>
          ))}
        </Container>
      </Box>

      {/* FOOTER */}
      <Box className="footer">
        <Typography component="div">
          CareerCraft © 2025&nbsp;•&nbsp;
          <Link to="/privacy">Privacy</Link>&nbsp;•&nbsp;
          <Link to="/terms">Terms</Link>
        </Typography>
      </Box>
    </>
  );
}
