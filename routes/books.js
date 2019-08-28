const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({extended:true}))

/* GET books listing. */
router.get('/', (req, res, next) => {
  Book.findAll({
    order: [["title", "ASC"]]
  })
  .then( books => res.render('index', { title: 'All Books', books }) )
});

router.post('/search', (req, res, next) => {
  Book.findAll({
    where: {
      [Op.or]: [
        { title:  { [Op.like]: `%${req.body.search}%` }},
        { author: { [Op.like]: `%${req.body.search}%` }},
        { genre:  { [Op.like]: `%${req.body.search}%` }}
      ]
    }
  })
  .then( books => res.render('index',  { title: 'Search Results', books }) );
})

/* GET new books form listing. */
router.get('/new', (req, res, next) => res.render('new-book',  { title: 'New Book', book: Book.build() }) );

/* POST CREATE new books by id. */
router.post('/new', (req, res, next) => {
  Book.create(req.body)
    .then( () => res.redirect(`/books`))
    .catch(err =>{
      if(err.name === "SequelizeValidationError"){
        res.render('new-book',  {
          title: 'New Book',
          book: Book.build(req.body),
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(error => res.sendStatus(500, error));
});

/* GET READ books by id. */
router.get('/:id', (req, res, next) => {
  Book.findById(req.params.id).then( book =>{ 
    book ? res.render('update-book',  { title: 'Update Book', book }) : (
      error = new Error('Page Not Found'),
      error.status=404,
      res.render('error',{error, title: `${error.status}-${error.message}`})
    );
  })
  .catch(error => res.sendStatus(500, error));
});

/* POST UPDATE books by id. */
router.post('/:id', (req, res, next) => {
  Book.findById(req.params.id)
  .then( book => book.update(req.body) )
  .then( () => res.redirect('/books') )
  .catch(error => res.sendStatus(500, error));
});

/* POST DELETE books by id. */
router.post('/:id/delete', (req, res, next) =>{
  Book.findById(req.params.id)
  .then( book => book.destroy() )
  .then( () => res.redirect('/books') );
});

module.exports = router;

// var express = require('express');
// var router = express.Router();
// var Book = require("../models").Book;

// const bodyParser= require('body-parser');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

// /* MAIN PAGE */
// router.get('/', function(req, res, next) {
    
//     Book.findAll({
//         order: [["title", "ASC"]]
//     }).then(function(books){
//     res.render("index", {title: "All Books", books}));
 
// })

// /* SEARCH */
// router.post('/search/', function(req, res, next) {
    
//     Book.findAll({
//         where: {
//             [Op.or]: [
//                 {title: { [Op.like]: `%${search}%` }},
//                 {author: { [Op.like]: `%${search}%` }},
//                 {genre: { [Op.like]: `%${search}%` }},
//                 {year: { [Op.like]: `%${search}%` }}
//             ]
//         }, 
//         order: [["title", "ASC"]]
//     }).then(function(books){
//         books.length > 0 ? res.render("books/index", {books: books, title: "Books found", searched: 1})
//                          : res.render("books/index", {title: "Books found", searched: 1 })
//     }).catch(function(error){
//     res.send(500, error);
//     });
// });


// /* NEW BOOK */
// router.get('/new', function(req, res, next) {
//     res.render("books/new-book", {book: {}, title: "New Book"});
// });

// router.post('/new', function(req, res, next) {
//     Book.create(req.body).then(function(book) {
//          res.redirect("/books/");
//     }).catch(function(error){
//         if(error.name === "SequelizeValidationError") {
//             const book = Book.build(req.body);
//             res.render("books/new-book", {book: book, errors: error.errors, title: "New Book"})
//         } else {
//             throw error;
//         }
//     }).catch(function(error){
//         res.send(500, error);
//      });
// ;});

// /* UPDATE */
// router.get("/:id/" , function(req, res, next){
//     Book.findByPk(req.params.id).then(function(book){
//       if(book) {
//           Book.update
//         res.render("books/update-book", {book: book, title: "Edit Book"});      
//       } else {
//         var err = new Error('Book Not Found');
//         err.status = 404;
//         res.render('page-not-found', {
//             message: err.message,
//             error: err
//           });;
//       }
//     }).catch(function(error){
//         res.send(500, error);
//      });
//   });

// router.post("/:id", function(req, res, next){
//     Book.findByPk(req.params.id).then(function(book){
//         if(book) {
//             return book.update(req.body);
//         } else {
//             res.send(404);
//         }
//     }).then(function(book){
//         res.redirect("/books/");        
//     }).catch(function(error){
//         if(error.name === "SequelizeValidationError") {
//             var book = Book.build(req.body);
//             book.id = req.params.id;
//             res.render("books/update-book", {book: book, errors: error.errors, title: "Update Book"})
//         } else {
//             throw error;
//         }
//     }).catch(function(error){
//         res.send(500, error);
//         });
// });

// /* DELETE */
// router.post("/:id/delete", function(req, res, next){
//     Book.findByPk(req.params.id).then(function(book){  
//         if(book) {
//             return book.destroy();
//             } else {
//             res.send(404);
//             }
//         }).then(function(){
//             res.redirect("/books");    
//         }).catch(function(error){
//             res.send(500, error);
//             });
//   });


// module.exports = router;
