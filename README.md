# 🚀 PrepTrack

**PrepTrack** is a full-stack coding platform that allows developers to practice algorithm problems, track their progress, and compete on a global leaderboard. Built with the **MERN Stack**, it features a robust code execution engine that supports multiple programming languages.

## ✨ Features

- **💻 Multi-Language Support:** Run and submit code in **C++**, **Python**, and **JavaScript**.
- **⚡️ Real-time Code Execution:** Secure, containerized execution environment (Docker-ready).
- **🏆 Global Leaderboard:** Rank users based on problems solved and difficulty levels.
- **📊 User Profiles:** Track solved problems, success rates, and difficulty breakdown (Easy/Medium/Hard).
- **🛠 Admin Dashboard:** Special access for admins to create and manage coding problems with test cases.
- **🔐 Secure Authentication:** JWT-based authentication with protected routes.

---

## 🛠 Tech Stack

### Frontend
- **React.js (Vite):** Fast, modern UI library.
- **Tailwind CSS:** For sleek, responsive styling.
- **Monaco Editor:** VS Code-like coding experience in the browser.
- **Axios:** For API communication.

### Backend
- **Node.js & Express.js:** RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible data schemas.
- **Child Process / Shell Execution:** For running user code securely.
- **Docker:** Containerized environment ensuring consistent execution across platforms (Render/Linux).

---

## 📸 Screenshots

*(Optional: Upload screenshots to your repository and link them here to showcase the UI)*

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas URI)
- **C++ Compiler (g++)** (Required for C++ execution locally on Windows/Linux)
- **Python 3** (Required for Python execution locally)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/preptrack.git](https://github.com/your-username/preptrack.git)
cd preptrack
```
### 2. Backend Setup
Navigate to the backend folder and install dependencies.
```bash
cd backend
npm install
```

Configure Environment Variables: Create a .env file in the backend directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the Server:
```bash
npm start
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies.
```bash
cd frontendT
npm install
```

Start the Client:
```bash
npm run dev
# Client will run on http://localhost:5173
```

## 🐳 Docker Deployment (Optional)
The backend is fully Dockerized for production deployment (e.g., Render, AWS).

Build & Run with Docker:
```bash
cd backend
docker build -t preptrack-backend .
docker run -p 5000:5000 --env-file .env preptrack-backend
```

## 📂 Project Structure
```bash
preptrack/
├── backend/             # Node.js API & Execution Engine
│   ├── controllers/     # Logic for Auth, Problems, Submissions
│   ├── models/          # Mongoose Schemas (User, Question, Submission)
│   ├── routes/          # API Routes
│   ├── temp/            # Temporary storage for code files
│   └── server.js        # Entry point
│
└── frontendT/           # React Frontend
    ├── src/
    │   ├── components/  # Reusable UI Components
    │   ├── axios/       # API Configuration
    │   └── App.jsx      # Main Routing
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License.
