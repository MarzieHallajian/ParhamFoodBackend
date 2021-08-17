const router = require('express').Router();
let Manager = require('../models/manager.model');
let Food = require('../models/food.model');
let Order = require('../models/order.model');
let Comment = require('../models/comment.model');

router.route('/comments/:name').get((req, res) => {
    Comment.find({'res_name': req.params.name}, function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
        return res.json(doc);
    });
  });

router.route('/reply').post((req, res) => {
    Comment.findById(req.body.id)
      .then(Comment => {
          Comment.reply = req.body.reply;
          Comment.save()
            .then(() => res.json(Comment))
            .catch(err => res.status(400).json('Error: ' + err));
  
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });


router.route('/orders/:name').get((req, res) => {
    Order.find({'res_name': req.params.name, 'user_accepted':true}, function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
        return res.json(doc);
    });
  });

router.route('/accept/order').post((req, res) => {
    Order.findById(req.body.id)
      .then(Order => {
          Order.manager_accepted = true;
          Order.save()
            .then(() => res.json(Order))
            .catch(err => res.status(400).json('Error: ' + err));
  
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/add/food').post((req, res) => {
    const name = req.body.name;
    const price = Number(req.body.price);
    const res_name = req.body.res_name;
    const available = Boolean(req.body.available);
    const pre_delay = Number(req.body.pre_delay);
    const newFood = new Food({
      name,
      price,
      res_name,
      available,
      pre_delay,
    });
  
    newFood.save()
    .then(() => res.json(newFood))
    .catch(err => res.status(400).json('Error: ' + err));
  });

  router.route('/delete/food').delete((req, res) => {
    let name;
    Food.findById(req.body.id)
      .then(Food => name = Food.name)
      .catch(err => res.status(400).json('Error: ' + err));
    Food.findByIdAndDelete(req.body.id)
      .then(() => res.json(`Food ${name} deleted.`))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  router.route('/update/food').post((req, res) => {
    Food.findById(req.body.id)
    .then(Food => {
        if (req.body.price) 
            Food.price =Number(req.body.price);
        if (req.body.res_name)
            Food.res_name = req.body.res_name;
        if (req.body.available)
            Food.availabe = Boolean(req.body.available);
        if(req.body.pre_delay)
            Food.pre_delay = Number(req.body.pre_delay);
  
        Food.save()
          .then(() => res.json(Food))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
  });
  

router.route('/register').post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const section = req.body.section;
  const address = req.body.address;
  const service_sections = req.body.service_sections;
  const working_hours = Date.parse(req.body.working_hours);
  const delay = Number(req.body.delay);
  const fee = Number(req.body.fee);
  const date = Date.parse(req.body.date);
  const newManager = new Manager({
    email,
    password,
    name,
    section,
    address,
    service_sections,
    working_hours,
    delay,
    fee,
    date,
  });

  newManager.save()
  .then(() => res.json(newManager))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/food/:res_name').get((req, res) => {
  const res_name = req.params.res_name;
  
  Food.find({'res_name': res_name}, function(err,doc){
      if (err)
          return res.status(400).json('Error: ' + err)
      return res.json(doc);
  });
  
});

router.route('/profile').post((req, res) => {
  const id = req.body.id;
  Manager.findById(id, function(err,doc){
      if (err)
          return res.status(400).json('Error: ' + err)
      return res.json(doc);
  });
  
});


router.route('/login').post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Manager.find({'email': email}, function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
        else if(doc[0]["password"] == password)
            return res.json(doc[0]);
        else 
            return res.json("no match!");

    });
    
  });

router.route('/update').post((req, res) => {
  Manager.findById(req.body.id)
    .then(Manager => {
        if (req.body.password)
            Manager.password = req.body.password;
        if (req.body.name)
            Manager.name = req.body.name;
        if (req.body.section)
            Manager.section = req.body.section;
        if (req.body.address)
            Manager.address = req.body.address;
        if (req.body.service_sections)
            Manager.service_sections = req.body.service_sections;
        if (req.body.working_hours)
            Manager.working_hours = Date.parse(req.body.working_hours);
        if (req.body.delay)
            Manager.delay = Number(req.body.delay);
        if (req.body.fee)
            Manager.fee = Number(req.body.fee);
        if (req.body.date)
            Manager.date = Date.parse(req.body.date);
  
        Manager.save()
          .then(() => res.json(Manager))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;