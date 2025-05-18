// src/components/ResumeGenerator.jsx
import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from 'jspdf';

export default function ResumeGenerator({
  profile,
  skills,
  education,
  experience,
  buttonLabel = 'Download CV',
}) {
  const handleDownload = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    let y = 60;

    // Header background
    doc.setFillColor(30, 144, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 50, 'F');

    // Name in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(profile.name, margin, 35);

    // Contact line below
    doc.setFontSize(10);
    doc.text(`Email: ${profile.email}`, margin, 50);

    // Draw a line
    y = 80;
    doc.setDrawColor(30, 144, 255);
    doc.setLineWidth(1);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);

    const section = title => {
      y += 20;
      doc.setFontSize(14);
      doc.setTextColor(30, 144, 255);
      doc.text(title, margin, y);
      y += 5;
      doc.setDrawColor(200);
      doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
      y += 15;
      doc.setTextColor(0);
      doc.setFontSize(11);
    };

    // Skills — two‑column
    if (skills?.length) {
      section('Skills');
      const colWidth = (doc.internal.pageSize.getWidth() - margin * 2) / 2;
      skills.forEach((skill, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        doc.text(skill, margin + col * colWidth, y + row * 15);
      });
      y += Math.ceil(skills.length / 2) * 15 + 10;
    }

    // Education
    if (education?.length) {
      section('Education');
      education.forEach(ed => {
        doc.text(`• ${ed}`, margin, y);
        y += 15;
        if (y > 700) { doc.addPage(); y = margin; }
      });
      y += 10;
    }

    // Experience
    if (experience?.length) {
      section('Experience');
      experience.forEach(exp => {
        doc.text(`• ${exp}`, margin, y);
        y += 15;
        if (y > 700) { doc.addPage(); y = margin; }
      });
    }

    doc.save('CareerCraft_CV.pdf');
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      sx={{
        bgcolor: 'var(--accent-primary)',
        color: 'var(--bg-primary)',
        '&:hover': { bgcolor: 'darken(var(--accent-primary), 10%)' },
        textTransform: 'none',
      }}
    >
      {buttonLabel}
    </Button>
  );
}
