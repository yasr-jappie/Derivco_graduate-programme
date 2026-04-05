# MzansiBuilds - Derivco Assessment

A full-stack application built for developers to build in public, share milestones, and collaborate. 

## 🎨 Design Theme
Built adhering to the requested strict design theme: Green, White, and Black.

## 🚀 Features (User Journeys Completed)
1. **Authentication:** Developers can create and manage their own accounts (JWT/Bcrypt).
2. **Project Creation:** Users can create project entries specifying the current stage and support required.
3. **Live Feed & Collaboration:** A public dashboard where developers can view all projects and leave comments/collaboration requests.
4. **Progress Tracking:** Project owners can continuously update their project stages and add new milestones.
5. **Celebration Wall:** Once a project is marked as "Completed," it is exclusively featured on the Celebration Wall.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)

## 💻 How to Run Locally

### 1. Start the Backend
Open a terminal and navigate to the backend folder:
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory with your MongoDB connection string and a JWT secret:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
\`\`\`
Start the server:
\`\`\`bash
node server.js
\`\`\`

### 2. Start the Frontend
Open a second terminal and navigate to the frontend folder:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The application will be running on `http://localhost:5173`.