import type { User } from './auth';

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}
