import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/note.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import studyScheduleRoutes from './routes/studySchedule.routes.js';
import progressRoutes from './routes/progress.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import cors from 'cors';
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3005', 
    credentials: true,  
  })
)
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/study-schedule', studyScheduleRoutes);
app.use('/api/v1/quizzes',quizRoutes)
app.use('/api/v1/flashcards',flashcardRoutes)
app.use('/api/v1/progress',progressRoutes)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };