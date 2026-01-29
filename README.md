```markdown
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
├── package.json           # Project dependencies
├── .gitignore             # Git ignore file
├── controllers/           # Route handlers
│   ├── users.js           # User controller logic
│   └── cards.js           # Card (article) controller logic
├── models/                # Database schemas
│   ├── users.js           # User schema (name, email, password, avatar, articles)
│   └── cards.js           # Article/Card schema (title, description, image, url, source, etc.)
├── routes/                # API routes
│   ├── index.js           # Root routes
│   ├── users.js           # User-related routes (auth, profile)
│   └── cards.js           # Card-related routes (create, list, delete)
└── utils/                 # Utility functions
    └── errors.js          # Error handling
```

## Database Schema

### User Schema
- `name`: String (required, 2-30 characters)
- `email`: String (required, unique, validated)
- `password`: String (required, hashed with bcryptjs)
- `avatar`: String (required, must be valid URL)

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

By default, the app runs on http://localhost:3000.

### Key Endpoints
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Login user (returns JWT token)
- `GET /api/users/me` - Get current user profile (protected)
- `PATCH /api/users/me` - Update profile (protected)
- `GET /api/cards` - Get user's saved articles (protected)
- `POST /api/cards` - Save an article (protected)
- `DELETE /api/cards/:cardId` - Delete a saved article (protected)

## Development Status

- Core user authentication and profile endpoints have been implemented.
- The Card model and basic card controller/routes (`GET`, `POST`, `DELETE`) are integrated into the backend.
- **Current focus**: Implementing API-to-frontend connectivity. Ongoing work includes:
   - Validating endpoints return the full article payload expected by the client.
   - Standardizing request/response schemas for save/load operations.
   - Configuring CORS and JWT token flow to enable frontend authentication and access to protected routes.

A Postman collection and example client code snippets are available to demonstrate authentication patterns and `/api/cards` endpoint usage.

## Frontend Integration Notes

- **Authentication**: The frontend must obtain a JWT token from `POST /api/users/login` and include it in the `Authorization: Bearer <token>` header on all protected requests.
- **Saving articles**: Submit complete article payloads to `POST /api/cards` with the following required fields: `title`, `description`, `image`, `url`, `source`, `publishedAt`.
- **Retrieving articles**: Call `GET /api/cards` to fetch all saved articles for the authenticated user. Responses contain an array of card objects ready for rendering.

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

```
