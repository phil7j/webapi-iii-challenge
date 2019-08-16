const express = require('express');

const router = express.Router();

// DB
const users = require('./userDb');
const posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
    console.log("Data recieved from Body", req.body);
    const user = req.body;

    // No name in Body? That returns an error


     users.insert(user)
        .then( user => {
            res.status(201).json(user)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const id = req.params.id
    const post = req.body

    posts.insert(post)
        .then( post => {
            res.status(200).json(post)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
});

router.get('/', (req, res) => {
    users.get()
    .then( users => {
        res.status(200).json(users)
    })
    .catch( err => {
        res.status(500).json({error: "There was an error while saving the user to the database"})
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id
    users.getById(id)
        .then( user => {
            !user ? res.status(404).json({message: "The user with the specified ID does not exist."}) :
            res.status(200).json(user)
        })
        .catch( err => {
            res.status(500).json({error: "There was an error while saving the user to the database"})
        })

});

router.get('/:id/posts', (req, res) => {
    const id = req.params.id
    posts.get()
        .then( posts => {
            let currentUser = posts.filter( post => post.user_id == id);
            res.status(200).json(currentUser)
        })
        .catch( err => {
            res.status(500).json({error: "There was an error while saving the user to the database"})
        })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    users.getById(id)
        .then( user => {
            !user ? res.status(404).json({message: "The post with the specified ID does not exist."}):
            users.remove(id)
                .then( data => {
                    res.status(200).json(user);
                })
                .catch( err => {
                    res.status(500).json({error: "The post could not be removed" })
                })
        .catch( err =>{
            res.status(500).json( {message: "Oh no! Something went wrong!"})
        })
        })
    //delete post and return it

});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body
    console.log("BODY", updatedUser)
    !updatedUser.name ? res.status(400).json({errorMessage: "Please provide a name for the user."}) :

            users.update(id,updatedUser)
                .then( response => {
                    console.log("Response from .update", response)
                    users.getById(id)
                        .then(user => {
                            console.log("response from findbyId", user);
                            !user ? res.status(404).json({message: "The post with the specified ID does not exist."}):
                            res.status(201).json(user)
                        })
                        .catch( err => {
                            res.status(500).json({ error: "There was an error while saving the post to the database" })
                        })
                })
                .catch( err => {
                    res.status(500).json({ error: "There was an error while saving the post to the database" })
                })
        })

//custom middleware

function validateUserId(req, res, next) {
    const id = req.body.user_id
    users.getById(id)
        .then( user => {
            !user ? res.status(404).json({message: "user not found!"}) :
            req.user = user;
            next();
        })
        .catch( err =>{
            res.status(500).json({message: "Uh oh! Unable to validate User ID!"})
        })
};

function validateUser(req, res, next) {
    const user = req.body
    !user ? res.status(400).json({errorMessage: "Please provide user data!"}) :
    !user.name ? res.status(400).json({errorMessage: "Please provide a name for the user."}) :
    next()
};

function validatePost(req, res, next) {
    const post = req.body
    !post ? res.status(400).json({errorMessage: "Please provide the post data!"}) :
    !post.text ? res.status(400).json({errorMessage: "Please provide text for the post."}) :
    next()
};

module.exports = router;
