const express = require('express');
const router = express.Router();
const User = require('../models/users');
const auth = require('../midleware/auth');
const isValid = require('../midleware/UserInvalidField');
const multer = require('multer');
const sharp = require('sharp');
const {sendInitialEmail,sendLastEmail} = require('../email/connection');
multerInstance = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)/))
      return cb(new Error('Please upload files with extension jpg/jpeg/png'), undefined);
    cb(undefined, true);
  }
})

router.post('/users', isValid, async (req, res) => {
  try {
    let user = new User(req.body,);
    await user.save();
    let token = await user.GenerateAuthToken();
    sendInitialEmail(user.email,user.name);
    res.status(201).send({ user: user.getPublicInfo(), token });
  } catch (e) {
    res.status(500).send(e);
  }
})
router.get('/users/me', auth, async (req, res) => {
  try {
    res.status(200).send(req.user.getPublicInfo());
  } catch (e) {
    res.status(500).send();
  }
})
router.patch('/users/', auth, isValid, async (req, res) => {
  try {
    let updates = Object.keys(req.body);
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    })
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
})
router.delete('/users/', auth, async (req, res) => {
  try {
    req.user.remove();
    sendLastEmail(req.user.email,req.user.name);
    res.status(200).send(req.user.getPublicInfo());
  } catch (e) {
    res.status(500).send(e);
  }
})
router.post('/users/login', isValid, async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    let token = await user.GenerateAuthToken();
    res.status(200).send({ user: user.getPublicInfo(), token });
  } catch (e) {
    res.status(401).send('Please Authenticate');
  }
})
router.get('/users/logout', auth, (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => req.token != token.token);
    req.user.save();
    res.send(200).send();
  }
  catch (e) {
    res.status(500).send();
  }
})
router.get('/users/logout/all', auth, (req, res) => {
  try {
    req.user.tokens = []
    req.user.save();
    res.send(200).send();
  }
  catch (e) {
    res.status(500).send();
  }
})

router.get('/users/viewprofilepicture/:id',auth,async (req,res)=>{
let id = req.params.id;
try{
let profile_picture = await User.findById({_id:id});
res.set('Content-Type','image/png');
res.status(200).send(profile_picture.profilepicture);
}catch(e){
  res.status(500).send();
}
})

router.post('/users/profilepicture', auth, multerInstance.single('update'), async (req, res) => {
  try {
    let buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.profilepicture = buffer;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
}, (err, req, res, next) => {
  res.status(400).send(err.message);
})

module.exports = router;