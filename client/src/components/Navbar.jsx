// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { auth, logout } = useContext(AuthContext);
  const user = auth?.user;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{
              textTransform: "none",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            CareerCraft
          </Button>
        </Typography>

        {/* Common Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>

          {user && (
            <>
              <Button component={Link} to="/upload" color="inherit">
                Upload
              </Button>
              <Button component={Link} to="/analysis" color="inherit">
                Analysis
              </Button>
              <Button component={Link} to="/jobs" color="inherit">
                Recommendations
              </Button>
              <Button component={Link} to="/applications" color="inherit">
                Applications
              </Button>
              <Button component={Link} to="/bookmarks" color="inherit">
                Bookmarks
              </Button>
              <Button component={Link} to="/admin/jobs" color="inherit">
                Post Job
              </Button>
            </>
          )}

          {!user && (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Theme Toggle */}
        <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
          {mode === "light" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* User Avatar & Menu */}
        {user && (
          <>
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{ elevation: 4, sx: { mt: 1.5, minWidth: 200 } }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem component={Link} to="/profile" onClick={handleClose}>
                My Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
