# News Explorer Server

A Node.js backend server for a news search application that allows authenticated users to browse articles from a news API and save them to their profile.

## Features

- **User Authentication**: Sign up and login with email/password authentication using JWT
- **News Search**: Fetch articles from a news API and display them in a modal interface
- **Save Articles**: Authenticated users can save articles to their profile
- **User Profiles**: Store user information including name, avatar, and saved articles
- **Article Management**: Save, retrieve, and manage saved news articles with full article data

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **Validation**: Validator.js for email and URL validation
- **Development**: Nodemon for hot-reloading

## Project Structure

```
.
├── app.js                 # Application entry point
├── package.json          # Project dependencies
├── .gitignore           # Git ignore file
├── controllers/         # Route handlers
│   └── users.js        # User controller logic
├── models/             # Database schemas
│   ├── users.js        # User schema (name, email, password, avatar, articles)
│   └── cards.js        # Article/Card schema (title, description, image, url, source, etc.)
├── routes/             # API routes
│   ├── index.js        # Root routes
│   └── users.js        # User-related routes (auth, profile, articles)
└── utils/              # Utility functions
    └── errors.js       # Error handling
```

## Database Schema

### User Schema
- `name`: String (required, 2-30 characters)
- `email`: String (required, unique, validated)
- `password`: String (required, hashed with bcryptjs)
- `avatar`: String (required, must be valid URL)
- `articles`: Array of references to saved Card documents

### Card (Article) Schema
- `owner`: Reference to User (required)
- `title`: String (required)
- `description`: String (required)
- `image`: String (required)
- `url`: String (required)
- `source`: String (required)
- `publishedAt`: Date (required)
- `createdAt`: Date (default: current timestamp)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RicardoVegaJr/News-Explorer-Server.git
   cd News-Explorer-Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** (not included in repo)
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Start the server**
   - Development (with hot-reload):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

## Usage

The server will run on `http://localhost:3000` by default.

### Key Endpoints (Example structure)
- `POST /users/signup` - Register new user
- `POST /users/signin` - Login user
- `GET /users/me` - Get current user profile
- `POST /cards` - Save an article
- `GET /cards` - Get user's saved articles
- `DELETE /cards/:cardId` - Delete a saved article

## Frontend Integration

The frontend should:
1. Fetch articles from the news API (or request from this backend)
2. Display articles in a modal with full information
3. On save, send the complete article data to the backend
4. Retrieve saved articles from `/cards` endpoint when viewing user profile

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens for stateless authentication
- Email validation using validator.js
- URL validation for avatar and article images

## Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm run lint` - Run ESLint to check code quality

## Author

Ricardo Vega Jr.
