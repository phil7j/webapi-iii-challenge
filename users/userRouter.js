const express = require('express');

const router = express.Router();

// DB
const users = require('./userDb');
const posts = require('../posts/postDb');

router.post('/', (req, res) => {
    console.log("Data recieved from Body", req.body);
    const user = req.body;

    // No name in Body? That returns an error
    !user.name ? res.status(400).json({errorMessage: "Please provide a name for the user."}) :

     users.insert(user)
        .then( user => {
            res.status(201).json(user)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
});

router.post('/:id/posts', (req, res) => {
    const id = req.params.id
    const post = req.body
    !post.text ||!post.user_id ? res.status(400).json({errorMessage: "Please provide a text and a user id for the user."}) :

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

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
