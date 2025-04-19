import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
import routes from "./routes/user.routes.js"
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.BASE_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Cohort !');
});

app.get('/rajnish', (req, res) => {
  res.send("rajnish is livee!");
});

// Connect to DB
db();

// User routes
app.use("/api/v1/users", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
