const express = require('express');
const router = express.Router();
const fetchuser= require("../middleware/fetchuser.js");
const Story = require("../database_models/StorySchema");
const { body, validationResult } = require('express-validator');


// ROUTE 1: get all notes, GET /api/notes/fetchallstory
router.get('/fetchallstory', fetchuser, async (req,res)=>{
    try {
        const story = await Story.find({user: req.user.id});
        res.send(story);
    } catch (err) {
        console.log(err);
        res.status(500).send("some error occured");
    }
})


// ROUTE 2: add story, POST /api/notes/addstory
router.post('/addstory', fetchuser,[
    body('title', 'Enter title').isLength({ min: 1 }),
    body('description', 'Enter description').isLength({ min: 1 }),
], async(req,res)=>{
    const errors = validationResult(req);
    //if some validtion error occurs then this if will run
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {title, description} =req.body;
        const story = new Story({
            title,description,user:req.user.id
        })

        const savedstory =await story.save();
        res.send("Story saved successfully\n"+ savedstory);
    } catch (err) {
        console.log(err);
        res.status(500).send("some error occured");
    }
})



// ROUTE 3: update story, POST /api/notes/updatestory
router.put('/updatestory:id', fetchuser, async(req, res)=>{
        try {
            const {title, description} = req. body;
            //create new story
            const newStory={};
            if(title){ newStory.title =title}
            if(description){ newStory.description =description}
            //find the story to be updated
            const story = await Story.findById(req.params.id);
            if(!story) {
                res.status(404).send("Not found!");
            }
            //check the same user is updating its story
            if(story.user.toString()!==req.user.id){
                res.status(401).send("Not allowed");
            }
            const storysaved =await Story.findByIdAndUpdate(req.params.id, {$set: newStory}, {new: true});
            res.json({storysaved});
        } catch (err) {
            console.log(err);
            res.status(500).send("some error occured");
        }
})



// ROUTE 4: delete story, POST /api/notes/deletestory
router.delete('/deletestory:id', fetchuser, async (req,res)=>{
    try {
        //find the story to be deleted
        const story = await Story.findById(req.params.id);
        if(!story) {
            res.status(404).send("Not found!");
        }
        //check the same user is deleting its story
        if(story.user.toString()!==req.user.id){
            res.status(401).send("Not allowed");
        }
        //deleting
        await Story.findByIdAndDelete(req.params.id);
        res.send("Notes has been deleted");
    }  catch (err) {
        console.log(err);
        res.status(500).send("some error occured");
    }
})
module.exports = router