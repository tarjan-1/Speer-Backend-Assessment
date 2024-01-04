# Speer-Backend-Assessment

Solution for the pre screening assessment

## Table of Contents

- [Introduction](#introduction)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Note Endpoints](#note-endpoints)
  - [Search Endpoint](#search-endpoint)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Secure and scalable RESTful API that allows users to create, read, update, and delete notes. The application should also allow users to share their notes with other users and search for notes based on keywords.

## Technical Stack

List the technologies and frameworks used in your project.

- Node.js "v18.18.0"
- Express.js: "^4.18.2"
- Mongoose : "^8.0.3"
- JWT for authentication - "jsonwebtoken": "^9.0.2"
- Zod for input validation - "zod": "^3.22.4"
- BCRYPT for Encrypting Password : "bcrypt": "^5.1.1"
- "express-rate-limit": "^7.1.5"

## Getting Started

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js "v18.18.0"
- Express.js: "^4.18.2"
- Mongoose : "^8.0.3"
- JWT for authentication - "jsonwebtoken": "^9.0.2"
- Zod for input validation - "zod": "^3.22.4"
- BCRYPT for Encrypting Password : "bcrypt": "^5.1.1"
- "express-rate-limit": "^7.1.5"

### Installation

Clone the repository:

```bash
git clone https://github.com/tarjan-1/Speer-Backend-Assessment.git


Install dependencies:

cd yourproject
npm install


Running the Application
Start the application:

npm start
The application will be accessible at http://localhost:3000.


API Endpoints
Authentication Endpoints
POST /api/auth/signup
Create a new user account.

Request:
{
  "username": "yourusername",
  "email": "you@example.com",
  "password": "yourpassword"
}

Response:
{
  "user": { "id": "userid", "username": "yourusername", "email": "you@example.com" },
  "token": "yourjsonwebtoken"
}


POST /api/auth/login
Log in to an existing user account and receive an access token.

Request:
{
  "email": "you@example.com",
  "password": "yourpassword"
}

Response:
{
  "user": { "id": "userid", "username": "yourusername", "email": "you@example.com" },
  "token": "yourjsonwebtoken"
}


Note Endpoints
GET /api/notes
Get a list of all notes for the authenticated user.

Response:
{
  "notes": [
    { "id": "noteid1", "title": "Note 1", "content": "Content 1" },
    { "id": "noteid2", "title": "Note 2", "content": "Content 2" }
  ]
}
GET /api/notes/:id
Get a note by ID for the authenticated user.

Response:
{
  "note": { "id": "noteid", "title": "Note Title", "content": "Note Content" }
}


POST /api/notes
Create a new note for the authenticated user.

Request:
{
  "title": "New Note",
  "content": "Note Content"
}

Response:
{
  "note": { "id": "newnoteid", "title": "New Note", "content": "Note Content" }
}



PUT /api/notes/:id
Update an existing note by ID for the authenticated user.

Request:
{
  "title": "Updated Note",
  "content": "Updated Content"
}

Response:
{
  "note": { "id": "updatednoteid", "title": "Updated Note", "content": "Updated Content" }
}



DELETE /api/notes/:id
Delete a note by ID for the authenticated user.

Response:
{
  "note": { "id": "deletednoteid", "title": "Deleted Note", "content": "Deleted Content" }
}



POST /api/notes/:id/share
Share a note with another user for the authenticated user.

Request:
{
  "userId": "otheruserid"
}

Response:
{
  "note": { "id": "sharednoteid", "title": "Shared Note", "content": "Shared Content" }
}


Search Endpoint
GET /api/search?q=:query
Search for notes based on keywords for the authenticated user.

Response:
{
  "results": [
    { "id": "resultnoteid1", "title": "Result Note 1", "content": "Result Content 1" },
    { "id": "resultnoteid2", "title": "Result Note 2", "content": "Result Content 2" }
  ]
}
```
