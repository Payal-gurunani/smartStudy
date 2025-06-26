import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/api/v1/users',userRoutes)
export { app };