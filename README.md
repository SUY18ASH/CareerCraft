# CareerCraft: AI-Powered Job Application Assistant

An intelligent web application built with the MERN stack and NLP that helps users upload and parse resumes, extract key skills, and receive personalized job recommendations.

---

## 🚀 Features

- **User Authentication:** Signup and login using JWT and MongoDB.
- **Resume Upload & Parsing:** Upload PDF resumes; extract raw text with `pdf-parse`.
- **Skill Extraction (NLP):** Identify technical skills, education entries, and experience snippets using simple keyword and regex matching.
- **Job Recommendation Engine:** Match extracted skills against stored job postings; recommend top 5 best-fit roles.
- **Dashboard:** Student dashboard to upload resumes, view analysis, and browse recommended jobs.
- **Admin (CLI/Postman):** Add job postings via API.

---

## 🧰 Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React.js, React Router, Material‑UI (MUI) |
| Backend     | Node.js, Express.js                      |
| Database    | MongoDB Atlas, Mongoose                  |
| File Upload | Multer                                    |
| Resume Parse| pdf‑parse                                 |
| Recommendation | Custom skill‑matching logic             |
| Auth        | bcryptjs, jsonwebtoken                    |

---

## 📁 Project Structure

```
career-craft/
├── client/                    # React front-end
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Login/Register forms
│   │   │   ├── Navbar.jsx
│   │   │   └── Student/         # StudentDashboard and related
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # Page-level components
│   │   │   ├── Home.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── ResumeAnalysis.jsx
│   │   │   └── JobRecommendations.jsx
│   │   ├── api.js               # Axios instance
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env                     # FRONTEND_API_URL, if needed

├── server/                    # Express back-end
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── authController.js
│   │   └── resumeController.js (if separated)
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── jobRoutes.js
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── .env                     # MONGO_URI, JWT_SECRET

├── ai-services/               # (Optional) Python microservices
│   ├── resume_parser.py
│   └── cover_letter_generator.py

├── README.md
└── .gitignore
``` 

---

## ⚙️ Local Setup

### 1. Backend
```bash
cd server
npm install
# Create .env with MONGO_URI and JWT_SECRET
npm run dev   # runs nodemon app.js
```

### 2. Frontend
```bash
cd client
npm install
# Ensure .env if needed
npm start
```

Visit:
- Frontend → http://localhost:3000
- Backend API → http://localhost:5000/api

---

## 🧪 API Endpoints

### Auth
| Method | Endpoint              | Body                                  | Description          |
|--------|-----------------------|---------------------------------------|----------------------|
| POST   | `/api/auth/register`  | `{ name, email, password }`           | Register new user    |
| POST   | `/api/auth/login`     | `{ email, password }`                 | Login and get token  |

### Resume
| Method | Endpoint              | Body (form-data or JSON)              | Description                   |
|--------|-----------------------|---------------------------------------|-------------------------------|
| POST   | `/api/resume/upload`  | form-data: `resume` (PDF file)        | Upload & extract text         |
| POST   | `/api/resume/analyze` | `{ text: extractedResumeText }`       | Extract skills/education/etc. |

### Jobs
| Method | Endpoint              | Body                                  | Description                  |
|--------|-----------------------|---------------------------------------|------------------------------|
| POST   | `/api/jobs/add`       | `{ title, company, description, location, skills[] }` | Add new job posting          |
| POST   | `/api/jobs/recommend` | `{ skills[] }`                        | Get top 5 recommended jobs   |

---

## 🎯 Usage Flow

1. **Register/Login** → create account or login.
2. **Upload Resume** (`/upload`) → PDF is parsed.
3. **Analyze Resume** (`/analysis`) → view extracted skills.
4. **Get Recommendations** → see jobs at `/jobs`.

---

## 📄 Author
**Suyash Chouksey**

---

## 📄 License
This project is open-source for academic purposes.

