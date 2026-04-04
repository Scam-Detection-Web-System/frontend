# Anti-Scam Web System - Frontend

Welcome to the frontend repository of the **Anti-Scam Web System**. This application provides a comprehensive platform to help users identify potential scams, specifically targeted at phone numbers, while providing educational resources and community-driven reporting mechanisms.

## 📸 Application Interface
* Home page and Scam check
<img width="1903" height="945" alt="image" src="https://github.com/user-attachments/assets/f25a4e91-7e8a-477e-9239-5ee14b8edaaf" />
* Admin dashboard
<img width="1909" height="946" alt="image" src="https://github.com/user-attachments/assets/4def222d-12a0-4d04-aee5-fabedb69eaf4" />
*Moderator dashboard
<img width="1919" height="948" alt="image" src="https://github.com/user-attachments/assets/65a9b1aa-3cbc-4888-b64f-a6434f72effa" />


## 🚀 Key Features

*   **Scam Checker:** A robust tool allowing users to search for phone numbers and retrieve official risk assessments or machine learning-based predictions regarding their safety.
*   **Community Reports & Comments:** Users can submit their own experiences, reports, and comments regarding specific phone numbers, fostering a community-driven database of potential threats.
*   **Educational Quizzes:** An interactive quiz module designed to educate users on recognizing and avoiding various types of scams.
*   **Blog & News System:** A content management system for publishing news, alerts, and articles related to cybersecurity and scam awareness.
*   **Role-Based Access Control (RBAC):** Secure dashboards and tailored experiences for different user roles:
    *   **User:** General access to search, comment, and take quizzes.
    *   **Moderator:** Access to the Moderator Dashboard to manage and review community reports.
    *   **Manager:** Capable of creating and updating official phone number assessments, managing quizzes, etc.
    *   **Admin:** Full system oversight, report management, and user administration.

## 🛠️ Technology Stack

This project is built with modern frontend technologies focusing on fast performance and an excellent developer experience:

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/) (Headless UI)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Forms & Validation:** React Hook Form + Zod
*   **Charts:** Recharts

## 🔰 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd anti-scam-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory based on the provided `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Populate the `.env` file with the necessary backend API URLs and configurations.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Building for Production

To create a production build, run:
```bash
npm run build
```
The optimized output will be generated in the `dist` directory, ready to be deployed to platforms like AWS CloudFront, Vercel, or Netlify.

## 📁 Project Structure highlights

*   `src/components/`: Reusable UI components.
*   `src/pages/` or `src/routes/`: Main application page components (Home, Scam Checker, Admin Dashboard, etc.).
*   `src/services/` or `src/api/`: API integration layers handling requests to the backend.

## 🤝 Contributing

When contributing to this project, please ensure all code adheres to the existing linting rules and TypeScript configurations. Run `npm run lint` before committing your changes.
