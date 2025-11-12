# AnonNote - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [Authentication Flow](#authentication-flow)
6. [Data Models](#data-models)
7. [Security](#security)
8. [Performance](#performance)
9. [Deployment](#deployment)

---

## System Architecture

### Overview

AnonNote is a serverless, mobile-first web application built on the Vercel platform with Firebase backend services.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Play   │  │  Inbox   │  │   Chat   │  │Questions │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘         │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                   API Layer (Next.js)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Auth     │  │  Messages  │  │    Chat    │            │
│  │   Routes   │  │   Routes   │  │   Routes   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐                            │
│  │ Questions  │  │   Upload   │                            │
│  │   Routes   │  │   Route    │                            │
│  └────────────┘  └────────────┘                            │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                   Backend Services                           │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │   Firebase     │  │   Firestore    │  │ Vercel Blob   │ │
│  │     Auth       │  │    Database    │  │   Storage     │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Architecture Principles

1. **Serverless First**: All API routes are serverless functions
2. **Real-time Updates**: Firebase real-time listeners for live data
3. **Mobile Optimized**: Mobile-first responsive design
4. **Progressive Web App**: Installable with offline support
5. **Type-Safe**: Full TypeScript implementation

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.0 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 4.1.9 | Styling framework |
| **shadcn/ui** | Latest | Component library |
| **Lucide React** | 0.454.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase Auth** | 12.5.0 | Anonymous authentication |
| **Firestore** | 12.5.0 | NoSQL database |
| **Vercel Blob** | 2.0.0 | File storage (profile pics) |
| **Next.js API Routes** | 16.0.0 | Serverless functions |

### Development Tools

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Vercel** | Hosting & deployment |

---

## Database Schema

### Collections Structure

\`\`\`
firestore/
├── users/                    # User profiles
│   └── {userId}/
│       ├── uid: string
│       ├── username: string
│       ├── profilePicture?: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── messages/                 # Anonymous messages
│   └── {userId}/            # Messages to a user
│       └── {messageId}/
│           ├── id: string
│           ├── recipientId: string
│           ├── senderId?: string
│           ├── content: string
│           ├── timestamp: timestamp
│           └── read: boolean
│
├── chat/                     # Global chat messages
│   └── {messageId}/
│       ├── id: string
│       ├── userId: string
│       ├── username: string
│       ├── profilePicture?: string
│       ├── content: string
│       └── timestamp: timestamp
│
└── questions/                # Public questions
    └── {questionId}/
        ├── id: string
        ├── userId: string
        ├── username: string
        ├── profilePicture?: string
        ├── content: string
        ├── timestamp: timestamp
        ├── replyCount: number
        └── replies/          # Subcollection
            └── {replyId}/
                ├── id: string
                ├── questionId: string
                ├── userId?: string
                ├── username?: string
                ├── content: string
                └── timestamp: timestamp
\`\`\`

### Indexes

**Firestore Composite Indexes:**

1. **Messages Collection**
   - `recipientId` (Ascending) + `timestamp` (Descending)
   - Used for: Fetching user's messages sorted by time

2. **Chat Collection**
   - `timestamp` (Descending)
   - Used for: Loading recent chat messages

3. **Questions Collection**
   - `timestamp` (Descending)
   - Used for: Loading questions feed

4. **Question Replies Subcollection**
   - `questionId` (Ascending) + `timestamp` (Ascending)
   - Used for: Loading replies for a question

---

## API Reference

### Authentication Endpoints

#### POST `/api/auth/signin`

Create a new anonymous user account.

**Request Body:**
\`\`\`typescript
{
  username: string;        // 3-20 characters
  profilePicture?: string; // Optional blob URL
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: true;
  userId: string;
  username: string;
}
\`\`\`

**Error Responses:**
- `400`: Invalid username
- `409`: Username already taken
- `500`: Server error

---

#### GET `/api/auth/check`

Check current authentication status.

**Response:**
\`\`\`typescript
{
  authenticated: boolean;
  userId?: string;
}
\`\`\`

---

#### POST `/api/auth/signout`

Sign out current user.

**Response:**
\`\`\`typescript
{
  success: true;
}
\`\`\`

---

### Message Endpoints

#### GET `/api/messages/[userId]`

Get all messages for a user.

**Parameters:**
- `userId` (path): User ID

**Response:**
\`\`\`typescript
{
  messages: Array<{
    id: string;
    recipientId: string;
    content: string;
    timestamp: number;
    read: boolean;
  }>;
}
\`\`\`

---

#### POST `/api/messages/[userId]`

Send an anonymous message to a user.

**Parameters:**
- `userId` (path): Recipient user ID

**Request Body:**
\`\`\`typescript
{
  content: string; // 1-500 characters
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: true;
  messageId: string;
}
\`\`\`

**Error Responses:**
- `400`: Invalid content
- `404`: User not found
- `500`: Server error

---

#### DELETE `/api/messages/[userId]/[messageId]`

Delete a message.

**Parameters:**
- `userId` (path): User ID
- `messageId` (path): Message ID

**Response:**
\`\`\`typescript
{
  success: true;
}
\`\`\`

---

### Chat Endpoints

#### GET `/api/chat`

Get recent global chat messages.

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50)

**Response:**
\`\`\`typescript
{
  messages: Array<{
    id: string;
    userId: string;
    username: string;
    profilePicture?: string;
    content: string;
    timestamp: number;
  }>;
}
\`\`\`

---

#### POST `/api/chat`

Send a message to global chat.

**Request Body:**
\`\`\`typescript
{
  content: string; // 1-500 characters
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: true;
  messageId: string;
}
\`\`\`

**Requires Authentication**: Yes

---

### Questions Endpoints

#### GET `/api/questions`

Get all public questions.

**Response:**
\`\`\`typescript
{
  questions: Array<{
    id: string;
    userId: string;
    username: string;
    profilePicture?: string;
    content: string;
    timestamp: number;
    replyCount: number;
  }>;
}
\`\`\`

---

#### POST `/api/questions`

Post a new public question.

**Request Body:**
\`\`\`typescript
{
  content: string; // 1-500 characters
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: true;
  questionId: string;
}
\`\`\`

**Requires Authentication**: Yes

---

#### GET `/api/questions/[questionId]/replies`

Get all replies to a question.

**Parameters:**
- `questionId` (path): Question ID

**Response:**
\`\`\`typescript
{
  replies: Array<{
    id: string;
    questionId: string;
    userId?: string;
    username?: string;
    content: string;
    timestamp: number;
  }>;
}
\`\`\`

---

#### POST `/api/questions/[questionId]/replies`

Reply to a question.

**Parameters:**
- `questionId` (path): Question ID

**Request Body:**
\`\`\`typescript
{
  content: string;    // 1-500 characters
  username?: string;  // Optional name for reply
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: true;
  replyId: string;
}
\`\`\`

---

### User Endpoints

#### GET `/api/user/[userId]`

Get user profile information.

**Parameters:**
- `userId` (path): User ID

**Response:**
\`\`\`typescript
{
  user: {
    uid: string;
    username: string;
    profilePicture?: string;
    createdAt: number;
  };
}
\`\`\`

---

### Upload Endpoints

#### POST `/api/upload-profile`

Upload a profile picture.

**Request Body:**
- `Content-Type`: `multipart/form-data`
- `file`: Image file (max 5MB, JPG/PNG)

**Response:**
\`\`\`typescript
{
  url: string; // Blob storage URL
}
\`\`\`

**Error Responses:**
- `400`: No file or invalid format
- `413`: File too large
- `500`: Upload failed

---

## Authentication Flow

### Initial Sign Up

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Client
    participant Firebase
    participant Firestore
    participant API

    User->>Client: Opens app
    Client->>Client: Check cookies
    Client->>User: Show auth page
    User->>Client: Enters username
    Client->>Firebase: signInAnonymously()
    Firebase-->>Client: Anonymous UID
    Client->>API: POST /api/auth/signin
    API->>Firestore: Check username exists
    Firestore-->>API: Not exists
    API->>Firestore: Create user document
    API-->>Client: Set userId cookie
    Client->>User: Redirect to inbox
\`\`\`

### Session Management

1. **Cookie-Based**: Session stored in HTTP-only cookie
2. **Duration**: 30 days
3. **Refresh**: Auto-renewed on each request
4. **Validation**: Checked on protected routes

### Security

- Anonymous auth prevents fake accounts
- Usernames are unique and validated
- Profile pictures scanned for inappropriate content
- Rate limiting on all endpoints

---

## Data Models

### TypeScript Interfaces

\`\`\`typescript
// User profile
interface User {
  uid: string;              // Firebase UID
  username: string;         // Unique username
  profilePicture?: string;  // Blob URL
  createdAt: number;        // Unix timestamp
  updatedAt: number;        // Unix timestamp
}

// Anonymous message
interface Message {
  id: string;          // Firestore document ID
  recipientId: string; // Receiving user ID
  senderId?: string;   // Always undefined (anonymous)
  content: string;     // Message text
  timestamp: number;   // Unix timestamp
  read: boolean;       // Read status
}

// Chat message
interface ChatMessage {
  id: string;              // Firestore document ID
  userId: string;          // Sender ID
  username: string;        // Sender username
  profilePicture?: string; // Sender profile pic
  content: string;         // Message text
  timestamp: number;       // Unix timestamp
}

// Public question
interface Question {
  id: string;              // Firestore document ID
  userId: string;          // Author ID
  username: string;        // Author username
  profilePicture?: string; // Author profile pic
  content: string;         // Question text
  timestamp: number;       // Unix timestamp
  replyCount: number;      // Number of replies
}

// Question reply
interface QuestionReply {
  id: string;         // Firestore document ID
  questionId: string; // Parent question ID
  userId?: string;    // Reply author ID (optional)
  username?: string;  // Reply author name (optional)
  content: string;    // Reply text
  timestamp: number;  // Unix timestamp
}
\`\`\`

---

## Security

### Authentication

- **Firebase Anonymous Auth**: No personal data required
- **Unique Usernames**: Enforced at database level
- **Session Cookies**: HTTP-only, secure, same-site

### Data Protection

1. **Firestore Security Rules:**

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read any user profile
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == userId;
    }
    
    // Messages to a user
    match /messages/{recipientId}/{messageId} {
      allow read: if request.auth.uid == recipientId;
      allow create: if true; // Anyone can send anonymous messages
      allow delete: if request.auth.uid == recipientId;
    }
    
    // Global chat
    match /chat/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Questions
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
      
      // Question replies
      match /replies/{replyId} {
        allow read: if true;
        allow create: if true;
        allow delete: if request.auth.uid == resource.data.userId;
      }
    }
  }
}
\`\`\`

2. **Content Validation:**
   - Message length limits (1-500 chars)
   - Username validation (3-20 chars, alphanumeric + underscore)
   - File size limits (5MB for images)
   - File type restrictions (JPG, PNG only)

3. **Rate Limiting:**
   - Vercel Edge Functions: 100 req/min per IP
   - Firebase: Configured per endpoint

### Privacy

- Anonymous messages store no sender info
- IP addresses not logged
- User data not sold or shared
- GDPR compliant data deletion

---

## Performance

### Optimization Strategies

1. **Code Splitting**
   - Dynamic imports for routes
   - Component-level code splitting
   - Tree shaking unused code

2. **Caching**
   - Static assets cached at edge
   - Firestore query caching
   - Browser localStorage for user preferences

3. **Real-time Updates**
   - Firebase listeners for live data
   - Debounced queries (5s intervals)
   - Pagination for large datasets

4. **Image Optimization**
   - Next.js Image component
   - Vercel Blob CDN
   - Automatic format conversion (WebP)

### Performance Metrics

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

---

## Deployment

### Vercel Configuration

\`\`\`javascript
// next.config.mjs
export default {
  reactStrictMode: true,
  images: {
    domains: ['blob.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
\`\`\`

### Environment Variables

**Required in Production:**

\`\`\`env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
\`\`\`

### CI/CD Pipeline

1. **Push to GitHub** → Triggers Vercel build
2. **Build Process** → Next.js compilation
3. **Tests** → (Optional) Run test suite
4. **Deploy** → Edge network deployment
5. **Monitoring** → Analytics tracking

### Rollback Strategy

1. Navigate to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"
4. Instant rollback (< 1 minute)

---

*Last updated: December 2024*
*Version: 1.0.0*
