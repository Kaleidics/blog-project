//require the express methods and the Express Router to modularize the routes
const express = require("express");
const router = express.Router();

const {BlogPosts} = require("./models");

function lorem() {
    return (`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    `);
}

BlogPosts.create("blogpost 1", lorem(), "First author");
BlogPosts.create("blogpost 2", lorem(), "Second author");

//get request to "/" path calls a function to respond in JSON with .get() a method of object BlogPosts, which
//is a function returning blog posts with a specific id if provided or else returns all blog posts
router.get("/", function (req, res) {
    res.json(BlogPosts.get());
});

//post request to "/" path calls a function which checks if the request contains the elements in array check
//if it doesn't return an error message or else declare a constant item containing the method .create from the object BlogPosts
//and respond with status 201 and in JSON, the constant item
router.post("/", function (req, res){
    //need three things a title, body, author
    const check = ["title", "content", "author"];
    //check if it has the above
    for(let i=0; i<check.length; i++) {
        const field = check[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //how is this line executed?
    const item = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author,
    );
    res.status(201).json(item); //why no return
})

//put request to path "/" calls a function which checks if the request body contains all the elements in array check
// if it doesnt return an error, then check if the id of the request parameters is the same as the id in the request body
// if it isnt return an error or else call .update(), which is a method of BlogPosts
router.put("/", function(req, res) {
    const check = ["id", "title", "content", "author", "publishDate"];
    for(let i=0; i<check.length; i++) {
        const field = check[i];
        if(!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id ${req.body.id} and ${req.params.id} must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();//end?
});

router.delete("/", function(req, res){
    BlogPosts.delete(req.params.id);
    console.log("Deleted")
    res.status(204).end();
});

module.exports = router;