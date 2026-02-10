# Project Management Collaboration Platform (專案管理協作平台)

## Overview
A modern, real-time project management tool integrating seamlessly with GitHub.

## Project Structure
- `backend/`: Backend Service (Spring Boot 3.x + Java 21)
- `frontend-web/`: Frontend Web Application (React + Vite + MUI)
- `frontend-app/`: Mobile Application (Flutter)
- `docker/`: Docker configurations (PostgreSQL + Redis)
- `devlog/`: Development logs
- `docs/`: Requirements and Documentation

## Getting Started

### Prerequisites
- Java 21+
- Node.js (v18+)
- Flutter SDK
- Docker & Docker Compose

### Running Locally

1. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```

2. **Start Infrastructure (DB + Redis)**:
   ```bash
   docker compose -f docker/compose.yaml up -d
   ```

3. **Backend (Spring Boot)**:
   ```bash
   cd backend
   # Build & Run using Maven Wrapper (if available) or installed Maven
   ./mvnw spring-boot:run 
   # OR
   mvn spring-boot:run
   ```

4. **Frontend Web (React)**:
   ```bash
   cd frontend-web
   npm install
   npm run dev
   ```

5. **Mobile App (Flutter)**:
   ```bash
   cd frontend-app
   flutter pub get
   flutter run
   ```

## Documentation
See `docs/需求/需求文檔.md` for detailed requirements.
