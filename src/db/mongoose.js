const mongoose = require('mongoose');
const url = process.env.MONGO_DB_CONNECT_STRING;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
//findAndModify is false because we dont want to receive deprecation warning , as this method is already deprecated and is set to true by default so mongoose tries to execute this