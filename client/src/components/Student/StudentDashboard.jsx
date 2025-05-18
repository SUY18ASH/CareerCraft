// src/components/student/StudentDashboard.jsx
import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextareaAutosize,
  Box,
  Grid,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import ResumeGenerator from '../ResumeGenerator';
import API from '../../api';
import PageLayout from '../PageLayout';

export default function StudentDashboard() {
  const { auth, logout } = useContext(AuthContext);
  const user = auth?.user;
  const showNotification = useContext(NotificationContext);
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);

  const resetState = () => {
    setResumeText('');
    setAnalysisResult(null);
    setRecommendedJobs([]);
  };

  const handleFileChange = e => {
    resetState();
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return showNotification('Select a resume file first!', 'error');
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      setLoadingUpload(true);
      const res = await API.post('/resume/upload', formData);
      setResumeText(res.data.extractedText);
      showNotification('Resume uploaded and parsed!', 'success');
    } catch {
      showNotification('Failed to upload resume', 'error');
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) return;
    try {
      setLoadingAnalyze(true);
      const res = await API.post('/resume/analyze', { text: resumeText });
      setAnalysisResult(res.data.analysis);
      showNotification('Resume analyzed!', 'success');
    } catch {
      showNotification('Failed to analyze resume', 'error');
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleRecommendJobs = async () => {
    if (!analysisResult?.skills?.length) return;
    try {
      const res = await API.post('/jobs/recommend', { skills: analysisResult.skills });
      setRecommendedJobs(res.data.recommendedJobs);
      showNotification('Jobs recommended!', 'success');
    } catch {
      showNotification('Failed to fetch recommendations', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PageLayout title={`Welcome, ${user?.name}!`}>
      {/* Logout Button */}
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* 1. Upload Resume */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>1. Upload Resume</Typography>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginTop: 8 }}
          />
          <Box className="action-buttons">
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!resumeFile}
              startIcon={loadingUpload && <CircularProgress size={20} />}
            >
              {loadingUpload ? 'Uploading…' : 'Upload & Parse'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 2. Extracted Text */}
      {resumeText && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>2. Extracted Resume Text</Typography>
            <TextareaAutosize
              minRows={8}
              style={{ width: '100%', marginTop: 8, background: 'var(--card-bg)', borderRadius: 8, padding: 8 }}
              value={resumeText}
              readOnly
            />
            <Box className="action-buttons" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleAnalyze}
                startIcon={loadingAnalyze && <CircularProgress size={20} />}
              >
                {loadingAnalyze ? 'Analyzing…' : 'Analyze Resume'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 3. Analysis Results + Download */}
      {analysisResult && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>3. Analysis Result</Typography>

            <Typography variant="subtitle1">Skills:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {analysisResult.skills.map((s, i) => (
                <Button key={i} size="small" variant="outlined">
                  {s}
                </Button>
              ))}
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Education:</Typography>
                <ul>
                  {analysisResult.education.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Experience:</Typography>
                <ul>
                  {analysisResult.experience.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </Grid>
            </Grid>

            <Box className="action-buttons" sx={{ mb: 2 }}>
              <ResumeGenerator
                buttonLabel="Download CV"
                profile={{ name: user.name, email: user.email }}
                skills={analysisResult.skills}
                education={analysisResult.education}
                experience={analysisResult.experience}
              />
            </Box>

            <Button variant="contained" onClick={handleRecommendJobs}>
              Get Job Recommendations
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 4. Recommended Jobs */}
      {recommendedJobs.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>4. Recommended Jobs</Typography>
            <ul>
              {recommendedJobs.map((job, i) => (
                <li key={i}>
                  <Typography>
                    <strong>{job.title}</strong> @ {job.company}
                  </Typography>
                  <Typography variant="body2">
                    Required: {job.skills.join(', ')}
                  </Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
