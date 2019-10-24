var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const URL = `mongodb+srv://bmurdock:#########@dhc-sample-uti3g.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true });

let app = client.connect()
  .then((connection) => {

    var app = express();
    app.locals.collection = connection.db('sample-stuff').collection('collectionName');

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(cors());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    process.on('SIGINT', () => {
      client.close();
      process.exit();
    })
    return app;
  })
  .catch((err) => {
    console.log('Oops: ', err);
  });
module.exports = app;