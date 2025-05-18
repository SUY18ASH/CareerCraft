// src/components/PageLayout.jsx
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

export default function PageLayout({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ py: 6, background: "var(--bg-primary)" }}>
        <Container maxWidth="md">
          {title && (
            <Typography
              variant="h4"
              sx={{ mb: 4, color: "var(--accent-primary)" }}
            >
              {title}
            </Typography>
          )}
          {children}
        </Container>
      </Box>
    </motion.div>
  );
}
