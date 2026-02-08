# Visual Defect Analysis & Root Cause Agent

**A Production-Grade React Application for Semiconductor Defect Analysis**

This project demonstrates a modern, high-performance dashboard for analyzing wafer defects using **Cosmos 2** (Visual Reasoning) and **Llama-3.1-Nemotron-Safety-Guard** (Data Security). It is designed to simulate a real-world scenario in a high-security semiconductor fabrication environment (e.g., TSMC, NVIDIA).

## 🚀 Key Features

*   **Role-Based Access Control (RBAC)**: Simulate "Equipment Engineer" vs. "Yield Engineer" views to demonstrate data access governance.
*   **Deep Zoom Viewer**: Interact with high-resolution SEM (Scanning Electron Microscope) images using pan and zoom capabilities.
*   **AI Visual Reasoning**: "Cosmos 2" simulated output provides physical descriptions and bounding box annotations of defects.
*   **Safety Guard**: "Llama-3.1-Nemotron" simulated output intercepts and redacts sensitive machine parameters (e.g., process recipes) based on user clearance.
*   **Diff View**: A visual comparison tool showing exactly what information was redacted by the Safety Guard.

## 🛠️ Tech Stack

*   **Frontend Framework**: React 18+ (Vite)
*   **Language**: TypeScript (Strict Typing)
*   **UI Library**: Ant Design (Enterprise Standard)
*   **State Management**: Zustand
*   **Specialized Components**:
    *   `react-zoom-pan-pinch` (Deep Zoom)
    *   `react-markdown` (Report Rendering)
    *   Custom Diff Viewer (Security Audit)

## 📦 How to Run

### 1. Backend (Python/FastAPI)
*   **Install Python Dependencies**:
    ```bash
    pip install fastapi uvicorn python-multipart requests python-dotenv httpx
    ```
*   **Start Backend Server**:
    ```bash
    python -m uvicorn backend.main:app --reload --port 8000
    ```
    *The backend will run at `http://localhost:8000`*

### 2. Frontend (React/Vite)
*   **Install Node Dependencies**:
    ```bash
    npm install
    ```
*   **Start Frontend Dev Server**:
    ```bash
    npm run dev
    ```
    *Open `http://localhost:5173` in your browser.*

---

## 🏛️ Architecture Decision Record (ADR)

> **Context**: Designing a secure, high-interactivity defect analysis dashboard for semiconductor manufacturing.

### 1. Client-Side Rendering (CSR) via React SPA
*   **Decision**: Adopted Single Page Application (SPA) architecture using Vite + React.
*   **Why**: The application heavily relies on complex DOM manipulations (Deep Zoom, Interactive Annotations) which require low-latency user interaction. SEO is irrelevant for this internal enterprise tool. CSR provides the snappiest experience for image-heavy workflows.

### 2. Security via Safety Guard (Backend-First Design)
*   **Decision**: Security logic is modeled as a backend "Safety Guard" layer (simulated here via mock API responses), not just frontend hiding.
*   **Why**: Frontend CSS hiding (`display: none`) is widely considered a security vulnerability ("Security via Obscurity"). This demo illustrates that the *data payload itself* is modified/redacted by the model intervention layer before even reaching the client for restricted roles. The frontend's role is merely to visualize this redaction (Diff View), not to enforce it.

### 3. TypeScript for Type Safety
*   **Decision**: Strict TypeScript enforcement.
*   **Why**: In the semiconductor domain, data precision is paramount. Type safety prevents category errors (e.g., confusing `DefectID` with `WaferID`) and ensures maintainability of the complex data structures returned by AI models.
