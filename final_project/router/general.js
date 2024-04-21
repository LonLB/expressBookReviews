const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"User successfully registered. You can now login."});
    }else{
      return res.status(404).json({message:"Username already in use!"})
    }
  }else{
    return res.status(404).json({message:"Unable to register user."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify({books},null,4));
});

// Get the lis of all books using axios async/await
public_users.get('/asyncbooks/', async function(req, res){
try{
  let response = await axios.get("http://localhost:5000/");
  return res.status(200).json(response.data)
}
catch(error){
return res.status(500).json({message:"Error getting book list"});
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(books[isbn]);
  }else{
    return res.send("Book not found.");
  }
 });

//Get books details based on ISBN using axios async/await
public_users.get('/asyncbooks/isbn/:isbn', async function(req, res){
  
  try{
   let response =  await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
  return res.status(404).json(response.data);
  }
  catch(error){
  return res.status(500).json({message:"Error getting book list."});
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 let author = req.params.author;
 let authorBooks = Object.values(books).filter((book)=> book.author === author);
 
  if(authorBooks.length>0){
    return res.send(authorBooks);
    }else{
     return res.send("No books for this author.");
    }
 
});

//Get books based on author with axios async/await
public_users.get('/asyncbooks/author/:author', async function(req, res){
const author = req.params.author;
try{
  let response = await axios.get(`http://localhost:5000/author/${author}`);
  return res.status(200).json(response.data);
}
catch(error){
  res.status(500).json({message: "Error fetching books details."});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
 let titleBooks = Object.values(books).filter((book)=> book.title === title);
  
 if(titleBooks.length>0){
    return res.send(titleBooks);
    }else{
     return res.send("Book not found.");
    }
});

//Get books based on author with axios async/await
public_users.get('/asyncbooks/title/:title', async function(req, res){
  const title = req.params.title;
  try{
    let response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  }
  catch(error){
    res.status(500).json({message: "Error fetching books details."});
  }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(!books[isbn]){
    return res.send("Book not found.")
  }else{
    const reviews = books[isbn].reviews;
    return res.send({reviews});
  }
});

module.exports.general = public_users;
