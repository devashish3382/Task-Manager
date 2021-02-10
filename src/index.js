require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/UserRouter');
const taskRouter = require('./routers/TaskRouter');
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log("Server running on port", port);
});