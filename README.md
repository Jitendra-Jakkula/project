# Note

A full-stack web application for organizing, managing, and working with notes.

> 🚧 Currently under development.

## Tech Stack

### Frontend

* React
* Vite
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Project Structure

```text
Note/
├── client/       # React frontend
├── server/       # Express backend
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Note
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Do not commit `.env` to GitHub.

## Status

V1 development in progress.
