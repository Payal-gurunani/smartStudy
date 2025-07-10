import { method } from "lodash";

export const endpoints = {
  //   Auth
  login: { method: "POST", url: "/users/login" },
  register: { method: "POST", url: "/users/register" },
  logout: { method: "POST", url: "/users/logout" },
  Profile : { method: "GET", url: "/users/profile" },
  checkLogin: { method: "GET", url: "/users/check-login" },

  // Notes
 getNotes: { method: "GET", url: "/notes" },
  createNote: { method: "POST", url: "/notes" },
  updateNote: (id) => ({ method: "PUT", url: `/notes/${id}` }),
  deleteNote: (id) => ({ method: "DELETE", url: `/notes/${id}` }),
  getNote: (id) => ({ method: "GET", url: `/notes/${id}` }),
  uploadPdf: { method: "POST", url: "/notes/upload-pdf" },

  summarizeNote: (id) => ({ method: "POST", url: `/notes/${id}/summarize` }),
  //  Quiz
  generateQuiz: (noteId) => ({ method: "POST", url: `/quizzes/from-note/${noteId}` }),
  submitQuiz: { method: "POST", url: "/quizzes/submit" },
  getQuizResults: { method: "GET", url: "/quizzes/quiz-results" },
  getQuizResultById: (id) => ({ method: "GET", url: `/quizzes/result/${id}` }),
  getQuizByNoteId: (noteId) => ({ method: "GET", url: `/quizzes/by-note/${noteId}` }),
  getAllQuizStatus: { method: "GET", url: "/quizzes/all-status" },


  // Flashcards
  generateFlashcards: (noteId) => ({
    method: "POST",
    url: `flashcards/${noteId}/generate-flashcards`,
  }),
  searchFlashcards: {
    method: "GET",
    url: "/flashcards/search",
  },
   
  progress : {
    method: "GET",
    url: "/progress",
  }
  ,
  flashcardReview: {
  method: "POST",
  url: "/progress/flashcard-review",
},
// Reminders
reminders: {
  getAll: { method: "GET", url: "/study-schedule" },
  create: { method: "POST", url: "/study-schedule" },
  updateStatus: (id) => ({ method: "PATCH", url: `/study-schedule/${id}` }),
  delete: (id) => ({ method: "DELETE", url: `/study-schedule/${id}` }),
}

};

