# Knowledge Sharing Platform

A mini "Stack Overflow" clone built with React, Node.js, Express, MongoDB, and TypeScript.

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally on default port 27017)

## Getting Started

### 1. Setup Backend (Server)

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Setup Frontend (Client)

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The client will start on `http://localhost:5173`.

## Features
- **Authentication**: JWT-based login and registration.
- **Questions**: Ask, list, search, view details, upvote/downvote.
- **Answers**: Post answers, upvote/downvote.
- **Reputation System**: 
  - +10 for answer upvote
  - -2 for answer downvote
  - +5 for question upvote
  - -1 for question downvote
- **Tags & Search**: Indexed full-text search and tag tracking.

## Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, React Hook Form, React Query (Axios), React Toastify.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB).
