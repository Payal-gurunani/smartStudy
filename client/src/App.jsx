import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Layout from "./Layout.jsx";
import Login from "./authentication/Login.jsx";
import Register from "./authentication/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Notes from "./pages/notes/Notes.jsx"; // ✅ import
import NotesList from "./pages/notes/NotesList.jsx";
import CreateNote from "./pages/notes/CreateNotes.jsx";
import EditNote from "./pages/notes/EditNotes.jsx";
import UploadPdfNote from "./pages/notes/UploadPdfNote.jsx";
import Home from "./components/Home.jsx";
import Profile from "./pages/Profile.jsx";
import NoteDetail from "./pages/notes/NoteDetail.jsx";
import GenerateQuizPage from "./pages/quizes/GenrateQuiz.jsx";
import QuizResultsPage from "./pages/quizes/QuizResults.jsx";
import QuizAttemptPage from "./pages/quizes/QuizAttempt.jsx";
import QuizSingleResultPage from "./pages/quizes/QuizSingleResultPage.jsx";
import Quizzess from "./pages/quizes/Quizzess.jsx";
import FlashcardList from "./pages/flashcards/FlashcardList.jsx";
import Reminders from "./pages/Reminders/Reminders.jsx";
function App() {
  const location = useLocation();

  return (
    <AnimatePresence >
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="flashcards"
            element={
              <ProtectedRoute>
                <FlashcardList />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/view"
            element={
              <ProtectedRoute>
                <NotesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/create"
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/edit/:id"
            element={
              <ProtectedRoute>
                <EditNote />
              </ProtectedRoute>
            }
          />

          <Route
            path="notes/upload"
            element={
              <ProtectedRoute>
                <UploadPdfNote />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes/:noteId/quiz/generate"
            element={
              <ProtectedRoute>
                <GenerateQuizPage />
              </ProtectedRoute>
            }
          />
          <Route path="/quizzes/:noteId/attempt" element={
            <ProtectedRoute>
              <QuizAttemptPage />
            </ProtectedRoute>
          }
          />


          <Route path="/quizzes/results" element=
            {
              <ProtectedRoute>
                <QuizResultsPage />
              </ProtectedRoute>

            }
          />

          <Route
            path="/quizzes/by-note/:noteId"
            element={
              <ProtectedRoute>
                <QuizAttemptPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quizzes/result/:id"
            element={
              <ProtectedRoute>
                <QuizSingleResultPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Quizzess />
              </ProtectedRoute>
            }
          />

          <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
          />

        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
