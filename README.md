# Smart Study Assistance

Smart Study Assistance is a MERN stack application designed to help users manage and enhance their study experience. The platform allows users to register, log in, and utilize a variety of study tools to improve learning efficiency.

## Features

- **User Authentication:** Secure registration and login with HTTP-only cookies.

- **PDF Notes Upload:** Upload PDF files and extract text for further processing.

- **Flashcards:** Create and manage flashcards by subject, topic, and tags.

- **AI-Powered Note Summarization:** Generate concise summaries from uploaded notes using NLP techniques.

- **Auto Quiz Generator:** Instantly generate multiple-choice quizzes based on your notes.

- **Quiz Attempt & Results:** Take quizzes, get instant results, and view past performance.

- **Profile Section:** view personalized data.

- **Progress Tracking:** Visualize and monitor your study progress over time.

- **Study Reminders:**Set and receive custom reminders to maintain consistent study habits.

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/Payal-gurunani/smartStudy.git
    ```
2. **Install dependencies**
    ## Server
    ```bash
    cd server
    npm install
    ```
   ## Client
    ```bash
    cd ../client
   npm install

    ```
3 . **Environment Variable**
## Server
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
OPENAI_API_KEY=your_openai_or_openrouter_key
## Client
VITE_API_BACKEND_URL=

## Technologies Used

Frontend: React.js, Tailwind CSS, Framer Motion

Backend: Node.js, Express.js

Database: MongoDB + Mongoose

Authentication: JWT with HTTP-only Cookies

Cloud Storage: Cloudinary

AI Integration: OpenAI / OpenRouter APIs for summarization and quiz generation






