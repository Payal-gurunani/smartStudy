import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/note.routes.js'
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/notes', noteRoutes);


app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };