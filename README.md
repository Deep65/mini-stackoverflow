# 🧠 Mini Stack Overflow

A mini "Stack Overflow" clone designed for users to ask questions, share knowledge, and build reputation within a developer community.

---

## 🚀 Quick Start Guide

Follow these simple steps to get the project running locally in minutes.

### 1. Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port `27017`)

### 2. Clone the Repository

```bash
git clone https://github.com/Deep65/mini-stackoverflow.git
cd knowledge-sharing-platform
```

### 3. Setup the Backend (Server)

Configuration is key! We need to set up the environment variables and install dependencies.

```bash
cd server
cp .env.example .env   # Create your environment file
npm install            # Install dependencies
npm run dev            # Start the server
```

✅ The server will launch at **`http://localhost:5000`**

### 4. Setup the Frontend (Client)

Open a **new terminal** window/tab and set up the React client.

```bash
cd client
cp .env.example .env   # Create your environment file
npm install            # Install dependencies
npm run dev            # Start the client
```

✅ The app will launch at **`http://localhost:5173`**

---

## ✨ Key Features

This platform is packed with features to emulate a real-world Q&A site:

- **🔐 Authentication**: Secure User Registration & Login (JWT-based).
- **💬 Q&A System**:
  - **Ask Questions**: Post detailed queries with rich text and tags.
  - **Provide Answers**: Help others by contributing your knowledge.
  - **Comments**: Discuss nuances in questions and answers.
- **👍 Voting & Reputation**:
  - **+10** rep for Answer Upvote
  - **+5** rep for Question Upvote
  - **-2** rep for Answer Downvote
  - **-1** rep for Question Downvote

---

## 🛠️ Technology Stack

| Area         | Technologies                                                        |
| :----------- | :------------------------------------------------------------------ |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form |
| **Backend**  | Node.js, Express, TypeScript                                        |
| **Database** | MongoDB, Mongoose (ODM)                                             |
| **Auth**     | JSON Web Tokens (JWT)                                               |

---

## 📂 Project Structure

```text
knowledge-sharing-platform/
├── client/           # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── server/           # Backend Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
└── README.md
```
