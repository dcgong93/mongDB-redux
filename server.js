var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/QuotingDojo');
var QuotesSchema = new mongoose.Schema({
  name: String,
  quote: String,
  created_at: String
})
mongoose.model('Quotes', QuotesSchema);
var Quotes = mongoose.model('Quotes');

app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './client')));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
});

app.post('/quotes', function(req, res){
  console.log("POST DATA", req.body);
  var quote = new Quotes({
    name: req.body.name,
    quote: req.body.quote,
    created_at: moment().format("h:mma MMMM Do YYYY")
  });
  quote.save(function(err){
    if(err){
      console.log('something went wrong');
    } else {
      console.log('Successfully added');
      res.redirect('/quotes')
    };
  });
});

app.get('/quotes', function(req, res){
  Quotes.find({}, function(err, quotes){
    res.render('quotes', {quotes:quotes})
  });
});

app.listen(8000, function(){
  console.log("listening on port 8000");
});
