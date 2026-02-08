# 🔬 Visual Defect Analysis Agent (VDA-Agent)

[![NVIDIA NIM](https://img.shields.io/badge/Powered%20By-NVIDIA%20NIM-76B900?style=for-the-badge&logo=nvidia)](https://build.nvidia.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Status](https://img.shields.io/badge/Status-Tech%20Preview-orange?style=for-the-badge)](https://github.com/Giga-Lu/agentic-defect-analyst)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A production-grade **Full-Stack AI Agent** designed for semiconductor manufacturing inspection. This system demonstrates the integration of **Visual Language Models (VLMs)** for defect reasoning and **LLM Safety Guardrails** for secure, role-based data redaction.

---

## 🏗️ Architecture & Scenario

In a modern semiconductor Fab, data security is as critical as yield. This project simulates a real-world scenario where high-resolution **SEM (Scanning Electron Microscope)** defect images are analyzed by AI, but the sensitive process parameters must be protected based on the user's role.

### The Problem
*   **Equipment Engineers** need absolute details to fix machines.
*   **Yield Engineers** need to see trends but should not access "Secret Sauce" recipe parameters (IP Protection).

### The Solution: Agentic Redaction
Instead of static masks, this system uses **NVIDIA Llama 3 (70B/405B)** via NIM to intelligently identify and redact PII/IP data within Root Cause Analysis (RCA) reports dynamically.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
*   **React 18 + TypeScript**: Type-safe component architecture.
*   **Vite**: Ultra-fast build tool and dev server.
*   **Ant Design (AntD)**: Enterprise-standard UI framework.
*   **React-Zoom-Pan-Pinch**: High-performance Deep Zoom engine for SEM imagery.
*   **Zustand**: Lightweight state management for RBAC (Role-Based Access Control).

### Backend (AI Middleware)
*   **FastAPI (Python)**: High-performance asynchronous API server.
*   **NVIDIA NIM Integration**:
    *   **Vision-Language Model**: Simulates/Connects to **Cosmos 2** for visual reasoning.
    *   **Security Guardrail**: Real-time redaction using **Llama-3.1-70b-instruct**.
*   **Httpx**: Asynchronous HTTP client for low-latency AI inference calls.

### Image Synthesis
*   **Advanced SVG Generators**: Custom-built engine to simulate SEM characteristics (Electron charging effects, fractal grain noise, and technical metadata bars).

---

## 👥 Role Definitions

| Role | Access Level | Data Display | Use Case |
| :--- | :--- | :--- | :--- |
| **Equipment Eng** | **Full (Normal)** | Raw RCA Reports | Inspecting specific machine values to perform maintenance. |
| **Yield Eng** | **Restricted** | **AI-Redacted** | Analyzing factory-wide trends without exposure to IP-sensitive recipes. |

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   Python (3.11+)
*   NVIDIA NIM API Key ([Get one here](https://build.nvidia.com))

### 2. Backend Setup
```bash
# Navigate to project root
cd agentic-defect-analyst

# Install dependencies
pip install fastapi uvicorn httpx python-dotenv

# Run the server
python backend/main.py
```
*Note: The server defaults to port 8000.*

### 3. Frontend Setup
```bash
# In a new terminal
npm install
npm run dev
```
*Open `http://localhost:5173` to view the agent.*

---

## 📸 Key Features & Screenshots

*   **SEM Deep Zoom**: Inspect at the nanometer scale with simulated electron-beam artifacts.
*   **Live AI Redaction**: Watch the report transform in real-time when switching roles, powered by Llama 3.
*   **Synthetic Data Engine**: Realistic wafer defect generation for zero-dependency testing.

---

## 📝 License
MIT License. Created for the NVIDIA NIM & Advanced Agentic Coding Showcase.
