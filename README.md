# JisNote

### A modern, secure, and responsive note-taking workspace

**JisNote** is a full-stack note-taking application built with **Next.js, TypeScript, Supabase, BlockNote, and Tailwind CSS**.

It provides authenticated users with a personal workspace where they can create, organize, edit, and manage notes with support for **nested notes**, **automatic saving**, **dark-only UI**, and a **responsive mobile experience**.

🌐 **Live Application:** https://jisnote.vercel.app/dashboard

📦 **GitHub Repository:** https://github.com/mjishaan59-cell/JisNote

---

## ✨ Features

### 🔐 Authentication

* User authentication powered by Supabase
* Protected dashboard
* Protected individual note routes
* Unauthenticated users are redirected to the login page
* Each user's notes are associated with their authenticated user ID

### 📝 Rich Note Editor

* Block-based editing powered by BlockNote
* Create and edit notes directly in the browser
* Rich content structure stored as JSON
* Automatic saving while editing
* Save status feedback

  * Saving
  * Saved
  * Save failed

### 🌳 Nested Notes

JisNote supports hierarchical note organization.

Example:

```text
📁 Programming
├── 📄 Python
│   ├── 📄 Python Basics
│   └── 📄 Python Projects
│
├── 📄 Docker
│   ├── 📄 Docker Basics
│   └── 📄 Docker Networking
│
└── 📄 Kubernetes
    ├── 📄 Pods
    └── 📄 Services
```

Notes can be organized using a parent-child relationship through the `parent_id` field.

### 📂 Note Management

* Create notes
* Create nested child notes
* Edit note titles
* Edit note content
* Delete notes
* Navigate between notes
* Expand and collapse nested note trees
* Automatic sidebar refresh when notes change

### 🌙 Dark-Only Interface

JisNote uses a dark-focused interface designed for comfortable long-term note taking.

The interface is optimized around:

* Dark workspace
* Dark sidebar
* Dark editor environment
* Consistent contrast
* Reduced visual distractions

### 📱 Mobile Experience

The application is responsive and usable on desktop and mobile devices.

Mobile features include:

* Mobile sidebar
* Responsive note tree
* Touch-friendly navigation
* Responsive editor layout
* Mobile workspace navigation
* Collapsible sidebar
* Mobile-friendly controls

### ⚡ Real-Time Updates

JisNote uses Supabase Realtime to keep note navigation synchronized when note data changes.

This allows the application to refresh the workspace when notes are created, updated, or deleted.

---

# 🛠️ Technology Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| **Next.js 16**   | Full-stack React framework             |
| **React**        | User interface                         |
| **TypeScript**   | Type-safe development                  |
| **Supabase**     | Authentication and PostgreSQL database |
| **BlockNote**    | Rich block-based note editor           |
| **Tailwind CSS** | Styling and responsive UI              |
| **Lucide React** | Interface icons                        |
| **Vercel**       | Production deployment                  |
| **Git & GitHub** | Version control                        |

Next.js can be deployed to Vercel with framework-aware deployment support.

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │   Desktop / Mobile   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Next.js        │
                         │     App Router       │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
          │   Supabase  │   │  BlockNote  │   │  Tailwind   │
          │    Auth     │   │    Editor   │   │     CSS     │
          └──────┬──────┘   └─────────────┘   └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │ PostgreSQL  │
          │   Database  │
          └─────────────┘
```

---

# 🗄️ Database Structure

The primary `notes` table contains the following fields:

| Column       | Type        | Description                  |
| ------------ | ----------- | ---------------------------- |
| `id`         | UUID        | Unique note identifier       |
| `user_id`    | UUID        | Authenticated note owner     |
| `title`      | TEXT        | Note title                   |
| `content`    | JSONB       | BlockNote document content   |
| `parent_id`  | UUID        | Parent note for nested notes |
| `created_at` | TIMESTAMPTZ | Creation timestamp           |
| `updated_at` | TIMESTAMPTZ | Last update timestamp        |

The `parent_id` field references the `notes.id` field, allowing JisNote to build hierarchical note structures.

```text
notes
│
├── id
├── user_id
├── title
├── content
├── parent_id ────────┐
├── created_at        │
└── updated_at        │
                     │
                     └── notes.id
```

---

# 🔒 Security

JisNote is designed around authenticated, user-specific access.

The application:

* Checks the Supabase authenticated user
* Protects `/dashboard`
* Protects `/notes/[id]`
* Associates newly created notes with the authenticated user's ID
* Restricts note reads and modifications to the authenticated user's notes
* Redirects unauthenticated users to `/login`

The server-side note operations use the authenticated Supabase session rather than trusting a user ID supplied by the browser.

> **Important:** Production applications should also maintain appropriate Supabase Row Level Security (RLS) policies on database tables. Application-level authorization should not be considered a replacement for database-level security.

---

# 📁 Project Structure

```text
JisNote/
│
├── src/
│   │
│   ├── app/
│   │   ├── actions/
│   │   │   └── notes.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── notes/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── callback/
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── BlockNoteEditor.tsx
│   │   ├── DeleteNoteButton.tsx
│   │   ├── Editor.tsx
│   │   ├── NoteTitle.tsx
│   │   ├── Sidebar.tsx
│   │   └── Workspace.tsx
│   │
│   └── lib/
│       └── supabase/
│
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git
* A Supabase project

---

## 1. Clone the repository

```bash
git clone https://github.com/mjishaan59-cell/JisNote.git
```

Move into the project:

```bash
cd JisNote
```

---

## 2. Install dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a local environment file:

```text
.env.local
```

Add the required Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ⚠️ Security

Never commit `.env.local` or private Supabase credentials to GitHub.

Your production environment variables should be configured through your deployment platform.

---

# ▶️ Run the Development Server

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Production Build

Before deploying, verify that the application builds successfully:

```bash
npm run build
```

A successful build should finish without TypeScript or compilation errors.

To run the production build locally:

```bash
npm run start
```

---

# 🚀 Deployment

JisNote is deployed on **Vercel**.

### Production URL

**https://jisnote.vercel.app/dashboard**

The project can be connected to a Git repository so that changes pushed to the production branch automatically deploy.