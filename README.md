# DSA Notebook

DSA Notebook is a full-stack web application for organizing coding problems and maintaining personal notes while practicing Data Structures and Algorithms.

## Live Demo

https://dsa-notebook.vercel.app

## Why I Built This

While solving DSA problems, I wanted a dedicated place to save problems, write notes, track my solving status, and easily revisit problems later.

DSA Notebook provides a simple workspace to organize coding problems and keep learning notes together.

## Features

- User registration and login
- JWT-based authentication
- Add problems using LeetCode URLs
- Automatic problem metadata detection
- Problem difficulty and topics
- Track problem status
- Rich-text notes
- Search problems by title
- Filter by difficulty, status, and topics
- Edit and save notes
- Delete problems
- Protected user data
- Responsive UI
- Production deployment

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Tiptap

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- Axios

### Database
- MongoDB
- Mongoose

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## How It Works

### 1. Add a Problem

The user pastes a LeetCode problem URL.

The application:

1. Validates the URL
2. Detects the platform
3. Extracts the problem slug
4. Fetches problem metadata
5. Displays a preview
6. Saves the problem to the user's collection

### 2. Problem Workspace

Each saved problem has its own workspace where users can:

- View problem information
- Open the original problem
- Write notes
- Track solving status
- View topics and difficulty

### 3. Search & Filtering

Problems can be searched by title and filtered by:

- Difficulty
- Status
- Topics

Multiple filters can be combined.

## Authentication

The application uses JWT-based authentication.

After login, the server generates a JWT containing the user's identity. Protected API routes verify the token before allowing access to user-specific data.

Passwords are hashed using bcrypt before being stored in the database.

## Database

MongoDB is used to store users and coding problems.

Each problem is associated with its user so that users can only access and manage their own problems.

## API

Main API areas include:

- Authentication
- Problem detection
- Problem management
- Problem updates
- Problem deletion

Protected endpoints require a valid JWT.

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
````

### Frontend

```env
VITE_API_URL=your_backend_api_url
```

## Running Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Technical Decisions

### Why MongoDB?

MongoDB provides a flexible document structure that works well for storing problem metadata, topics, status, and rich notes.

### Why JWT?

JWT provides a simple way to authenticate users and protect API routes in a REST-based application.

### How does URL detection work?

The application validates the submitted URL, checks whether it belongs to a supported platform, extracts the LeetCode problem slug, and uses that slug to retrieve the problem metadata.

### How are notes stored?

Notes are created using Tiptap's rich-text editor and stored with the corresponding problem so they can be loaded and edited later.

## Future Improvements

* Support for more coding platforms
* Code snippets in notes
* Image and GIF attachments
* Better revision tracking
* Problem statistics
* Advanced sorting and filtering
* AI-assisted notes and explanations

## License

This project was built as a personal learning and portfolio project.

```

This is enough for **V1**. Clean GitHub README, explains the project, and gives you several solid interview talking points without turning the README into documentation nobody wants to read. 🚀
```
