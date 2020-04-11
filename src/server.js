const express = require('express');
const app = express();
const bandcampRouter = require('./routers/bandcampRouter');

const port = 4000;

app.use('/api', bandcampRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});