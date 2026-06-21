# DevSync

DevSync is a repository-based real-time collaborative development workspace designed to simplify team-based software development.

The platform enables multiple developers to work on the same repository simultaneously while keeping project files, folder structures, and code changes synchronized in real time.

Unlike traditional workflows that rely on manual file sharing or frequent synchronization operations, DevSync provides a centralized workspace where collaborators can access and modify the same project environment.

## Problem Statement

Collaborative development often requires team members to continuously exchange project files or perform synchronization operations to stay updated with the latest project state.

This process can lead to:

- Duplicate project versions
- Manual file sharing
- Synchronization conflicts
- Reduced development efficiency

DevSync addresses these challenges by providing a shared repository workspace with real-time synchronization capabilities.

---

## Key Features

- User Authentication
- Repository Management
- Collaborator Management
- Real-Time Code Synchronization
- Real-Time File & Folder Synchronization
- Repository-Based Workspace
- Online Collaborator Presence
- Repository Persistence
- ZIP Export Support

---

## Technology Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

---

## System Architecture

Frontend (React.js)

↓

Backend API (Node.js + Express)

↓

Socket.IO Real-Time Layer

↓

MongoDB Database

---

## Project Structure

The platform is designed around repositories as the primary collaboration unit.

Each repository contains:

- Files
- Folders
- Collaborators
- Repository Metadata

All repository changes are synchronized instantly among connected users.

---

## Future Enhancements

- Activity Logs
- Version History
- Repository Snapshots
- Built-In Code Execution
- AI-Assisted Development Tools
- Repository Analytics

---

## Project Status

Currently under active development.

This repository contains project planning documents including:

- Product Requirements Document (PRD)
- Technical Requirements Document (TRD)
- Application Flow
- UI/UX Design Brief
- Backend Schema Design
- Implementation Plan

---

## License

This project is developed for educational and academic purposes.
