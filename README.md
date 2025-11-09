# AnonNote - Anonymous Messaging App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/coderegtechs-projects/v0-anon-note-react-native-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/oPV0lKqPusN)

## Overview

A modern anonymous messaging application built with Next.js 16, Firebase, and Vercel Blob. This repository stays in sync with your deployed chats on [v0.app](https://v0.app).

## Features

- **Anonymous Authentication**: Sign up anonymously with Firebase Auth
- **Personal Inbox**: Receive anonymous messages via shareable link
- **Global Chat**: Real-time chat with all users
- **Public Questions Feed**: Post questions and receive anonymous replies
- **Profile Uploads**: Upload profile pictures with Vercel Blob
- **Mobile-Optimized UI**: Beautiful gradient design inspired by modern social apps

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Authentication**: Firebase Anonymous Auth
- **Database**: Firestore
- **File Storage**: Vercel Blob
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui

## Environment Variables

You need to set the following environment variables in the **Vars** section of the in-chat sidebar or in your Vercel project settings:

\`\`\`env
# Firebase Client Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Config (Server-side only)
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# Vercel Blob (for profile picture uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

## Getting Started

1. **Set up Firebase**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Anonymous Authentication
   - Create a Firestore database
   - Download service account key and add credentials to environment variables

2. **Set up Vercel Blob**:
   - Create a Vercel Blob store in your project
   - Add the `BLOB_READ_WRITE_TOKEN` to environment variables

3. **Run locally**:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Features Overview

### Play Tab
- Share your personalized link
- Customize your prompt message
- Copy link to clipboard

### Inbox Tab
- View all received anonymous messages
- Messages sorted by timestamp

### Chat Tab
- Real-time global chat with all users
- Send and receive messages instantly

### Questions Tab
- Post public questions
- Reply to questions anonymously
- View all replies in a dialog

## Deployment

Your project is live at:

**[https://vercel.com/coderegtechs-projects/v0-anon-note-react-native-app](https://vercel.com/coderegtechs-projects/v0-anon-note-react-native-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/oPV0lKqPusN](https://v0.app/chat/oPV0lKqPusN)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## License

MIT
