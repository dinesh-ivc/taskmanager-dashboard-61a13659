-- Create table: users
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    full_name varchar(255),
    password_hash varchar(255) NOT NULL,
    avatar_url text,
    theme_preference varchar(20) DEFAULT 'light' NOT NULL,
    role text DEFAULT 'user' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create table: tasks
CREATE TABLE IF NOT EXISTS tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    title varchar(255) NOT NULL,
    description text,
    status varchar(50) DEFAULT 'todo' NOT NULL,
    priority varchar(20) DEFAULT 'medium' NOT NULL,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    category varchar(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    assigned_to uuid
);
CREATE  INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
CREATE  INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);
CREATE  INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Create table: user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    token_hash varchar(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_revoked boolean NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions (user_id);
CREATE  INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions (expires_at);
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
