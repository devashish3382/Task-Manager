const express = require('express');
const router = express.Router();
const auth = require('../midleware/auth');
const isValid = require('../midleware/TaskInvalidField');
const Task = require('../models/tasks');
router.post('/task', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send();
  }
})
router.patch('/tasks/:id', auth, isValid, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate({ _id: id, owner: req.user._id },req.body,{new:true});
    if (!task)
      return res.status(404).send("There is nothing to update");
    res.status(200).send(task);
  }
  catch (e) {
    res.status(500).send();
  }
})
router.get('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id })
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
})
router.get('/tasks', auth, async (req, res) => {
  const sort = {}, match = {};
  if (req.query.completed)
    match.completed = req.query.completed == 'true';
  if (req.query.sortBy) {
    let fields = req.query.sortBy.split(':');
    sort[fields[0]] = fields[1] == 'desc' ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        skip: parseInt(req.query.skip),
        limit: parseInt(req.query.limit),
        sort
      }
    }).execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    task = await Task.findByIdAndDelete({ _id: req.params.id });
    if (!task)
      return res.status(404).send('There is nothing to delete');
    res.status(200).send(task);
  }
  catch (e) {
    res.status(500).send();
  }
})

module.exports = router;