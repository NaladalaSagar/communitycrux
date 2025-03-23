
import { User } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  threadCount: number;
  color: string;
};

export type Thread = {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  isPinned?: boolean;
  isFeatured?: boolean;
  tags?: string[];
};

export type Comment = {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  isAnswer?: boolean;
  parentId?: string;
  children?: Comment[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  joinedAt: Date;
  threadCount: number;
  commentCount: number;
  reputation: number;
};

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "admin",
    joinedAt: new Date("2023-01-15"),
    threadCount: 24,
    commentCount: 152,
    reputation: 1250
  },
  {
    id: "2",
    name: "Sam Wilson",
    email: "sam@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "moderator",
    joinedAt: new Date("2023-02-10"),
    threadCount: 17,
    commentCount: 94,
    reputation: 830
  },
  {
    id: "3",
    name: "Jamie Lee",
    email: "jamie@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "user",
    joinedAt: new Date("2023-03-05"),
    threadCount: 8,
    commentCount: 46,
    reputation: 320
  },
  {
    id: "4",
    name: "Taylor Kim",
    email: "taylor@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "user",
    joinedAt: new Date("2023-04-01"),
    threadCount: 5,
    commentCount: 28,
    reputation: 175
  }
];

// Mock categories
export const categories: Category[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "Talk about anything related to our community",
    icon: <User />,
    threadCount: 124,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "questions",
    name: "Questions & Answers",
    description: "Get help from the community",
    icon: <User />, 
    threadCount: 89,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "showcase",
    name: "Showcase",
    description: "Share your work with the community",
    icon: <User />,
    threadCount: 56,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "resources",
    name: "Resources",
    description: "Useful links and resources",
    icon: <User />,
    threadCount: 42,
    color: "bg-amber-100 text-amber-600"
  },
  {
    id: "news",
    name: "News & Updates",
    description: "Latest news and platform updates",
    icon: <User />,
    threadCount: 38,
    color: "bg-red-100 text-red-600"
  },
  {
    id: "meta",
    name: "Meta",
    description: "Discussions about this forum",
    icon: <User />,
    threadCount: 23,
    color: "bg-gray-100 text-gray-600"
  }
];

// Mock threads
export const threads: Thread[] = [
  {
    id: "thread-1",
    title: "Welcome to our new community platform",
    content: "We're excited to launch our new community platform. This is a place for us to share ideas, ask questions, and help each other. Let's make this community great together!",
    categoryId: "general",
    authorId: "1",
    author: users[0] as any,
    createdAt: new Date("2023-05-10T14:30:00"),
    commentCount: 24,
    upvotes: 45,
    downvotes: 2,
    isPinned: true,
    isFeatured: true,
    tags: ["announcement", "welcome"]
  },
  {
    id: "thread-2",
    title: "How to get started with React hooks?",
    content: "I'm relatively new to React and I'm trying to understand hooks. Can someone explain how useState and useEffect work in simple terms?",
    categoryId: "questions",
    authorId: "3",
    author: users[2] as any,
    createdAt: new Date("2023-05-12T10:15:00"),
    commentCount: 17,
    upvotes: 28,
    downvotes: 0,
    tags: ["react", "hooks", "javascript", "frontend"]
  },
  {
    id: "thread-3",
    title: "Just launched my first project - feedback welcome!",
    content: "After months of work, I've finally launched my personal website. I'd love to get some feedback from the community on design, performance, and overall user experience.",
    categoryId: "showcase",
    authorId: "2",
    author: users[1] as any,
    createdAt: new Date("2023-05-14T16:45:00"),
    commentCount: 32,
    upvotes: 51,
    downvotes: 3,
    isFeatured: true,
    tags: ["showcase", "feedback", "design"]
  },
  {
    id: "thread-4",
    title: "Upcoming features for Q3 2023",
    content: "We're planning to introduce several new features in the next quarter. Here's what you can expect...",
    categoryId: "news",
    authorId: "1",
    author: users[0] as any,
    createdAt: new Date("2023-05-15T09:30:00"),
    commentCount: 19,
    upvotes: 37,
    downvotes: 1,
    isPinned: true,
    tags: ["roadmap", "features", "updates"]
  },
  {
    id: "thread-5",
    title: "Best resources for learning TypeScript in 2023",
    content: "I'm looking to improve my TypeScript skills. Can anyone recommend some up-to-date resources for learning TypeScript in 2023?",
    categoryId: "resources",
    authorId: "4",
    author: users[3] as any,
    createdAt: new Date("2023-05-16T11:20:00"),
    commentCount: 22,
    upvotes: 42,
    downvotes: 0,
    tags: ["typescript", "learning", "resources"]
  },
  {
    id: "thread-6",
    title: "Suggestions for improving the forum search functionality",
    content: "I've noticed that the search functionality could use some improvements. Here are some suggestions...",
    categoryId: "meta",
    authorId: "2",
    author: users[1] as any,
    createdAt: new Date("2023-05-17T13:10:00"),
    commentCount: 15,
    upvotes: 29,
    downvotes: 2,
    tags: ["feedback", "search", "improvements"]
  }
];

// Mock comments
export const comments: Comment[] = [
  {
    id: "comment-1",
    threadId: "thread-1",
    content: "This is amazing! I'm excited to be part of this community.",
    authorId: "3",
    author: users[2] as any,
    createdAt: new Date("2023-05-10T15:10:00"),
    upvotes: 12,
    downvotes: 0
  },
  {
    id: "comment-2",
    threadId: "thread-1",
    content: "Great initiative! Looking forward to engaging with everyone here.",
    authorId: "2",
    author: users[1] as any,
    createdAt: new Date("2023-05-10T15:45:00"),
    upvotes: 10,
    downvotes: 0
  },
  {
    id: "comment-3",
    threadId: "thread-2",
    content: "useState is a hook that lets you add state to function components. useEffect allows you to perform side effects in your components. Think of useEffect as componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
    authorId: "2",
    author: users[1] as any,
    createdAt: new Date("2023-05-12T11:05:00"),
    upvotes: 18,
    downvotes: 0,
    isAnswer: true
  },
  {
    id: "comment-4",
    threadId: "thread-2",
    content: "To add to that, here's a simple example of useState: const [count, setCount] = useState(0); This creates a state variable called count with an initial value of 0, and a function to update it called setCount.",
    authorId: "1",
    author: users[0] as any,
    createdAt: new Date("2023-05-12T13:20:00"),
    upvotes: 15,
    downvotes: 0,
    parentId: "comment-3"
  },
  {
    id: "comment-5",
    threadId: "thread-3",
    content: "Your website looks fantastic! I love the clean design and how fast it loads. Great work!",
    authorId: "4",
    author: users[3] as any,
    createdAt: new Date("2023-05-14T17:30:00"),
    upvotes: 9,
    downvotes: 0
  }
];

// Function to get threads by category
export const getThreadsByCategory = (categoryId: string) => {
  return threads.filter(thread => thread.categoryId === categoryId);
};

// Function to get thread by id
export const getThreadById = (threadId: string) => {
  return threads.find(thread => thread.id === threadId);
};

// Function to get comments by thread id
export const getCommentsByThreadId = (threadId: string) => {
  return comments.filter(comment => comment.threadId === threadId);
};

// Function to get featured threads
export const getFeaturedThreads = () => {
  return threads.filter(thread => thread.isFeatured);
};

// Function to get pinned threads
export const getPinnedThreads = () => {
  return threads.filter(thread => thread.isPinned);
};

// Function to get user by id
export const getUserById = (userId: string) => {
  return users.find(user => user.id === userId);
};
