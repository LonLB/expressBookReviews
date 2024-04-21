const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let sameusername = users.filter(user => {
  return user.username === username
});
if(sameusername.length>0){
  return false;
}else{
  return true;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) =>{
  return (user.username === username && user.password === password)
});
if(validusers.length>0){
  return true;
}else{
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}
if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
    data: password
  }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken,username
}
return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = req.query.reviews;
  const username = req.session.username;

  if(!reviews){
    res.status(404).send("Please provide a review.");
  }
  if(!books[isbn]){
  res.status(404).send("Book not found.");
  }
  if(books[isbn].reviews[username]){
    books[isbn].reviews[username] = reviews;
    res.status(200).send("Review successfully updated.");
  }
  else{
    books[isbn].reviews[username] = reviews;
    res.status(200).send("Review successfully added.");
  }
})

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if(!books[isbn]){
    res.status(404).send("Book not found.");
  }
  if(!books[isbn].reviews[username]){
    res.status(200).send("No available reviews for current user.");
  }
    delete books[isbn].reviews[username];
    res.status(200).send("Review successfully deleted.");
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
