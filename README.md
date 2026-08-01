# HealthHaven

HealthHaven is a comprehensive digital mental health and holistic wellness platform. Designed with privacy, accessibility, and user well-being at its core, HealthHaven provides an intuitive suite of tools to help users monitor emotional states, access therapeutic AI guidance, connect anonymously with peers, track physical wellness, and practice mindfulness.

## Table of Contents

- Overview
- Features
- Tech Stack
- Getting Started
  - Prerequisites
  - Installation
  - Environment Configuration
  - Running Locally
  - Building for Production
- Project Structure
- License

## Overview

Modern life brings unique stresses and mental health challenges. HealthHaven offers a supportive environment where individuals can track their mood trends, access real-time AI-powered mental wellness mentoring, engage in anonymous community support, and utilize calming mindfulness resources—all wrapped in a responsive design featuring customizable ambient themes and dark mode support.

## Features

- Dynamic Dashboard: Real-time overview of daily mood logs, streak tracking, quick action items, and personal wellness progress.
- Mood Tracking: Log daily emotional states, track mood triggers, and view historical insights and trends.
- AI Wellness Companion: Interactive AI assistant offering empathetic support, wellness strategies, and guided reflection based on Google's Gemini models.
- Anonymous Help Wall: Peer-to-peer support network allowing users to share experiences and lend support while maintaining complete anonymity.
- Serenity Corner: Calming interactive space featuring ambient sound generators, breathing exercises, and mindfulness activities.
- Physical Wellbeing: Tools to track physical health metrics that impact mental wellness, including sleep quality, hydration, and movement.
- Wellness Guide: Knowledge repository containing articles, coping mechanisms, and evidence-based mental health resources.
- Crisis Resources: Immediate, dedicated access to crisis hotlines, emergency contacts, and professional support networks.
- Adaptive Theming: Multi-theme support with dark mode, high-contrast options, and smooth ambient background animations.

## Tech Stack

### Frontend
- React 19
- React Router v7
- Vite 5
- Tailwind CSS v4 & PostCSS
- Emotion (React & Styled)
- Lucide React & Material UI Icons

### Services & Integration
- Firebase (Authentication & Cloud Firestore)
- Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites

Ensure you have Node.js (version 18.0.0 or higher) and npm installed on your system.

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/project-hackathon2k26.git
cd project-hackathon2k26
npm install
```

### Environment Configuration

Create a `.env` file in the root directory and configure your Firebase and Google AI key credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the built application locally:

```bash
npm run preview
```

## Project Structure

```text
.
├── api/                  # Serverless function handlers / API endpoints
├── public/               # Static assets
├── src/
│   ├── assets/           # Application images and branding assets
│   ├── components/       # Reusable UI components (auth, common, layout)
│   ├── pages/            # Main application views and feature pages
│   ├── services/         # Firebase auth, Firestore, and AI service integrations
│   ├── theme/            # Theme context and color configuration
│   ├── App.jsx           # Main application routing and core logic
│   ├── main.jsx          # React application entry point
│   └── style.css         # Global styling and custom utility definitions
├── index.html            # Application HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite bundler configuration
└── package.json          # Project dependencies and script declarations
```

## License

This project is released under the MIT License.
