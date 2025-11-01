# Emodash: Your AI Mental Wellness Companion

Emodash is a Next.js application built with Firebase, Genkit, and ShadCN UI. It serves as a personal AI companion for mood tracking, offering real-time emotion detection and personalized wellness recommendations.

## Live Demo

You can view a live demo of the application here:
[https://bxcd.netlify.app](https://bxcd.netlify.app)

## Getting Started

To get this project running locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Firebase and Google AI project credentials.

    ```env
    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    
    # Genkit/Google AI Config
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
