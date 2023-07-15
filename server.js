require('dotenv').config(({path: __dirname + '/config/.env'}))

let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express');
const app = express();

let UserModel = require('./models/User')

app.use('/request-type', (req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});
app.use(require('body-parser').urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.get('*', function(req, res){
  UserModel.find({}).then((resp)=>{
    res.send(resp);
    return resp;
  }).catch((err) => console.log(err));
});

app.use(express.json());
app.post('*', (req, res) => {
  let newUser = new UserModel(req.body);
  newUser.save();
  res.json("This user has been added \n" + req.body);
});

app.put('*', (req, res) => {  
  let id = req.body._id
  delete req.body._id;
  UserModel.findOneAndUpdate({_id: id}, req.body , {new: true})
  .then(UserModel.find({_id: id}).then((resp)=>{
    console.log(resp);
    return resp;
  }).catch((err) => console.log(err)))
  res.json("Updated");
});

app.delete('*', (req, res) => {  
  let id = req.body._id
  UserModel.findByIdAndRemove(id).then(
    UserModel.find({_id: id}).then((resp)=>{
      console.log(resp);
      return resp;
    }).catch((err) => console.log(err)));
  res.json("Updated");
});

app.listen(3000, () => console.log('Example app is listening on port http://localhost:3000'));