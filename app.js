const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler ::: <= ISSUE: works with invalid off main route but not off of invalid id  /books/:id
app.use((req, res, next) =>{
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',  { title: 'Page Not Found' });
});

module.exports = app;
// // var createError = require('http-errors');
// var express = require('express');
// var path = require('path');

// var bodyParser = require('body-parser');


// var routes = require('./routes/index');
// //var usersRouter = require('./routes/users');
// var books = require('./routes/books');
// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(bodyParser.json());


// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/books', books);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Page Not Found');
//   err.status = 404;
//   next(err);
// });

// // development error handler

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('page-not-found', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('page-not-found', {
//     message: err.message,
//     error: {}
//   });
// });
// module.exports = app;

