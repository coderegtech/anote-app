# AnonNote - Code Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Core Components](#core-components)
3. [Utility Functions](#utility-functions)
4. [Hooks](#hooks)
5. [API Routes](#api-routes)
6. [Firebase Integration](#firebase-integration)
7. [Contributing Guidelines](#contributing-guidelines)

---

## Project Structure

\`\`\`
anote-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (serverless functions)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── check/
│   │   │   ├── signin/
│   │   │   └── signout/
│   │   ├── chat/                 # Global chat endpoints
│   │   ├── messages/             # Message endpoints
│   │   │   └── [userId]/
│   │   │       └── [messageId]/
│   │   ├── questions/            # Questions endpoints
│   │   │   └── [questionId]/
│   │   │       └── replies/
│   │   ├── upload-profile/       # Profile upload
│   │   └── user/                 # User profile endpoints
│   │       └── [userId]/
│   ├── auth/                     # Auth page
│   ├── inbox/                    # Inbox page
│   ├── u/                        # User message pages
│   │   └── [userId]/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home redirect
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── global-chat.tsx           # Chat component
│   ├── inbox-client.tsx          # Inbox component
│   ├── questions-feed.tsx        # Questions component
│   ├── send-message-form.tsx     # Send message form
│   └── theme-provider.tsx        # Theme context
├── hooks/                        # Custom React hooks
│   ├── use-data.tsx              # Data context hook
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase config
│   ├── firestore-types.ts        # TypeScript types
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
│   ├── icon-192.jpg              # PWA icon
│   ├── icon-512.jpg              # PWA icon
│   └── manifest.json             # PWA manifest
├── docs/                         # Documentation
│   ├── USER_GUIDE.md
│   ├── TECHNICAL_DOCUMENTATION.md
│   └── CODE_DOCUMENTATION.md
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
├── README.md                     # Project overview
└── tsconfig.json                 # TypeScript config
\`\`\`

---

## Core Components

### InboxClient (`components/inbox-client.tsx`)

Main inbox component displaying received anonymous messages.

**Purpose**: Display and manage anonymous messages

**Props**: None (uses auth context)

**Key Features**:
- Real-time message updates
- Message deletion
- Tab navigation (Play, Inbox, Chat, Questions)
- Shareable link generation

**Code Structure**:
\`\`\`typescript
export function InboxClient() {
  // State management
  const [activeTab, setActiveTab] = useState<"play" | "inbox" | "chat" | "questions">("play");
  const [messages, setMessages] = useState<Message[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Firebase real-time listener
  useEffect(() => {
    const messagesRef = collection(db, `messages/${user.uid}`);
    const q = query(messagesRef, orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });
    
    return () => unsubscribe();
  }, [user.uid]);
  
  // Render
  return (
    <div className="mobile-full-height">
      {/* Tab Navigation */}
      {/* Content based on activeTab */}
    </div>
  );
}
\`\`\`

**Usage**:
\`\`\`tsx
import { InboxClient } from "@/components/inbox-client";

export default function InboxPage() {
  return <InboxClient />;
}
\`\`\`

---

### GlobalChat (`components/global-chat.tsx`)

Real-time global chat component.

**Purpose**: Enable community-wide conversations

**Props**: 
- `currentUser`: User object from auth context

**Key Features**:
- Real-time message streaming
- Auto-scroll to latest messages
- Message sending
- Profile picture display

**Code Structure**:
\`\`\`typescript
export function GlobalChat({ currentUser }: { currentUser: User }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Load chat messages with real-time updates
  useEffect(() => {
    const chatRef = collection(db, "chat");
    const q = query(chatRef, orderBy("timestamp", "desc"), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs.reverse());
    });
    
    return () => unsubscribe();
  }, []);
  
  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await addDoc(collection(db, "chat"), {
        userId: currentUser.uid,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
        content: newMessage.trim(),
        timestamp: Date.now(),
      });
      setNewMessage("");
    } catch (error) {
      toast({ title: "Failed to send message" });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      {/* Input form */}
    </div>
  );
}
\`\`\`

---

### QuestionsFeed (`components/questions-feed.tsx`)

Public questions and replies component.

**Purpose**: Community Q&A feature

**Props**:
- `currentUser`: User object from auth context

**Key Features**:
- Post new questions
- View all questions
- Reply to questions (with optional name)
- View replies in dialog

**Code Structure**:
\`\`\`typescript
export function QuestionsFeed({ currentUser }: { currentUser: User }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [replies, setReplies] = useState<QuestionReply[]>([]);
  
  // Load questions
  useEffect(() => {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(qs);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Post question
  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    await addDoc(collection(db, "questions"), {
      userId: currentUser.uid,
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      content: newQuestion.trim(),
      timestamp: Date.now(),
      replyCount: 0,
    });
    
    setNewQuestion("");
  };
  
  // Load replies for selected question
  const loadReplies = async (questionId: string) => {
    const repliesRef = collection(db, `questions/${questionId}/replies`);
    const q = query(repliesRef, orderBy("timestamp", "asc"));
    
    const snapshot = await getDocs(q);
    const reps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setReplies(reps);
  };
  
  return (
    <div className="space-y-4">
      {/* Post question form */}
      {/* Questions list */}
      {/* Replies dialog */}
    </div>
  );
}
\`\`\`

---

### SendMessageForm (`components/send-message-form.tsx`)

Form for sending anonymous messages.

**Purpose**: Allow users to send anonymous messages to profile owners

**Props**:
- `recipientId`: User ID to send message to
- `recipientUsername`: Display username
- `recipientProfilePicture`: Display profile picture

**Code Structure**:
\`\`\`typescript
export function SendMessageForm({
  recipientId,
  recipientUsername,
  recipientProfilePicture,
}: SendMessageFormProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await addDoc(collection(db, `messages/${recipientId}`), {
        recipientId,
        content: message.trim(),
        timestamp: Date.now(),
        read: false,
      });
      
      toast({ title: "Message sent anonymously!" });
      setMessage("");
    } catch (error) {
      toast({ title: "Failed to send message" });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="gradient-bg min-h-screen p-4">
      {/* Header card with username */}
      {/* Message textarea */}
      {/* Send button */}
      {/* "Get your messages!" button */}
    </div>
  );
}
\`\`\`

---

## Utility Functions

### Firebase Utilities (`lib/firebase.ts`)

Firebase initialization and configuration.

\`\`\`typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
\`\`\`

---

### Class Name Utilities (`lib/utils.ts`)

Helper for conditional class names.

\`\`\`typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind merge
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

**Usage**:
\`\`\`tsx
<div className={cn(
  "base-class",
  isActive && "active-class",
  "override-class"
)} />
\`\`\`

---

## Hooks

### useAuth Hook (`lib/auth-context.tsx`)

Authentication context and hook.

\`\`\`typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      
      if (data.authenticated && data.userId) {
        // Load user data from Firestore
        const userDoc = await getDoc(doc(db, "users", data.userId));
        if (userDoc.exists()) {
          setUser({ uid: userDoc.id, ...userDoc.data() } as User);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
\`\`\`

**Usage**:
\`\`\`tsx
const { user, loading, signOut } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Not authenticated</div>;
\`\`\`

---

### useMobile Hook (`hooks/use-mobile.tsx`)

Detect mobile viewport.

\`\`\`typescript
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return isMobile;
}
\`\`\`

---

### useToast Hook (`hooks/use-toast.ts`)

Toast notification system.

\`\`\`typescript
export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    // Implementation using shadcn/ui toast
  };
  
  return { toast };
}
\`\`\`

**Usage**:
\`\`\`tsx
const { toast } = useToast();

toast({
  title: "Success!",
  description: "Message sent",
});
\`\`\`

---

## API Routes

### Authentication Routes

See [API Reference](#api-reference) in Technical Documentation for detailed endpoint documentation.

**Implementation Pattern**:
\`\`\`typescript
// app/api/auth/signin/route.ts
export async function POST(request: Request) {
  try {
    // Parse request body
    const { username, profilePicture } = await request.json();
    
    // Validate input
    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Invalid username" },
        { status: 400 }
      );
    }
    
    // Check if username exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return NextResponse.json(
        { error: "Username taken" },
        { status: 409 }
      );
    }
    
    // Create Firebase anonymous user
    const { user } = await signInAnonymously(auth);
    
    // Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      profilePicture: profilePicture || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      userId: user.uid,
      username,
    });
    
    response.cookies.set("userId", user.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
\`\`\`

---

## Firebase Integration

### Firestore Queries

**Reading Data**:
\`\`\`typescript
// Get single document
const userDoc = await getDoc(doc(db, "users", userId));
const userData = userDoc.data();

// Query collection
const messagesRef = collection(db, `messages/${userId}`);
const q = query(
  messagesRef,
  where("read", "==", false),
  orderBy("timestamp", "desc"),
  limit(20)
);
const snapshot = await getDocs(q);
const messages = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
\`\`\`

**Writing Data**:
\`\`\`typescript
// Add document (auto ID)
await addDoc(collection(db, "chat"), {
  userId: "abc123",
  content: "Hello world",
  timestamp: Date.now(),
});

// Set document (specific ID)
await setDoc(doc(db, "users", userId), {
  username: "john_doe",
  createdAt: Date.now(),
});

// Update document
await updateDoc(doc(db, "users", userId), {
  profilePicture: "https://...",
  updatedAt: Date.now(),
});

// Delete document
await deleteDoc(doc(db, "messages", messageId));
\`\`\`

**Real-time Listeners**:
\`\`\`typescript
useEffect(() => {
  const q = query(
    collection(db, "chat"),
    orderBy("timestamp", "desc"),
    limit(50)
  );
  
  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(messages);
  });
  
  // Cleanup on unmount
  return () => unsubscribe();
}, []);
\`\`\`

---

## Contributing Guidelines

### Code Style

1. **TypeScript**: Use strict type checking
2. **Naming**: Use camelCase for variables, PascalCase for components
3. **Comments**: Document complex logic and public APIs
4. **Formatting**: Use Prettier defaults

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with clear commits
3. Push branch: `git push origin feature/your-feature`
4. Create pull request
5. Wait for review and approval
6. Merge to main

### Testing

Run tests before committing:
\`\`\`bash
pnpm test
pnpm lint
pnpm build
\`\`\`

### Pull Request Template

\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass

## Screenshots
(if applicable)
\`\`\`

---

*Last updated: December 2024*
*Version: 1.0.0*
