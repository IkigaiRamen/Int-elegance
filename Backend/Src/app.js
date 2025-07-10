const express = require("express");
const connectDB = require("./Config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const projectRoutes = require("./Routes/projectRoutes");
const companyRoutes = require("./Routes/companyRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const bodyParser = require("body-parser");
const ChatRoutes = require("./Routes/ChatRoutes");
const subtaskRoutes = require("./Routes/subTaskRoutes");
const statsRoutes = require("./Routes/statsRoutes");
const userRoutes = require("./Routes/userRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  allowedHeaders: ['Authorization', 'Content-Type'], // Explicitly allow the Authorization header
  credentials: true, // Allow credentials if you need cookies
}));
app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));


app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes); 
app.use("/api/tasks", taskRoutes); 
app.use('/api/companies', companyRoutes);
app.use('/api/chat', ChatRoutes);
app.use('/api/subtask' , subtaskRoutes);
app.use('/api/stats', statsRoutes);

const connectAndStartServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

connectAndStartServer();

module.exports = app;
