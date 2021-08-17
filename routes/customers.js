const router = require('express').Router();
let Customer = require('../models/customer.model');
let Comment = require('../models/comment.model');
let Food = require('../models/food.model');
let Order = require('../models/order.model');
let Manager = require('../models/manager.model');

// router.route('/favorite/:custphone').get(function(req,res,nxt){
//     const cust_phone = req.params.custphone;
//     Order.find({'cust_phone': cust_phone},function(err,doc){
//         if (err)
//             return res.status(400).json('Error: ' + err);
//         return res.json(doc);
//     }); 
// });

router.route('/order/finish').post((req, res) => {
    const id = req.body.id;
    Order.findByIdAndUpdate(id,{'finished':true})
    .then((order) => res.json(order))
    .catch((err) =>res.status(400).json('Error: ' + err));
    ;
  });

router.route('/order/final').post(async function(req,res,nxt){
    const id = req.body.id;
    let total;
    let cust_phone;
    let order;
    await Order.findById(id,function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        doc["user_accepted"] = true;
        total = doc["total"];
        cust_phone = doc["cust_phone"];
        doc.save()
            .catch(err => res.status(400).json('Error: ' + err));
        order = doc;
        
    }); 
    await Customer.find({'phonenum':cust_phone}, function(err,doc){
        if (err)
        return res.status(400).json('Error: ' + err);
        if (Number(doc[0]["credit"]) - total < 0){
            res.json('Please Charge');
            Order.findByIdAndUpdate(id,{'user_accepted':false})
                .catch(err => res.status(400).json('Error: ' + err));
        }else{
            doc[0]["credit"] = doc[0]["credit"] - total;
            doc[0].save()
                .then(()=>res.json(order))
                .catch(err => res.status(400).json('Error: ' + err));
        }
    });
});

router.route('/order/reorder').post(async function(req,res,nxt){
    const id = req.body.id;
    let total_t;
    let cust_phone_t;
    let new_order;
    await Order.findById(id,function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        
        const list = doc["list"];
        const total = doc["total"];
        const manager_accepted = false;
        const pre_delay = doc["pre_delay"];
        const sent_delay = doc["sent_delay"];
        const finished = false;
        const user_accepted = true;
        const cust_phone = doc["cust_phone"];
        const res_name = doc["res_name"];
        total_t = doc["total"];
        cust_phone_t = doc["cust_phone"];
        const newOrder = new Order({
                total,
                list,
                cust_phone,
                res_name,
                user_accepted,
                manager_accepted,
                pre_delay,
                sent_delay,
                finished,
        });
        new_order = newOrder;
        newOrder.save()
            .catch(err => res.status(400).json('Error: ' + err));
        
        
    }); 
    await Customer.find({'phonenum':cust_phone_t}, function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        if (doc[0]["credit"] - total_t < 0){
            res.json('Please Charge');
            Order.findByIdAndUpdate(new_order.id,{'user_accepted':false,'manager_accepted':false})
                .catch(err => res.status(400).json('Error: ' + err));
        }else{
            doc[0]["credit"] = doc[0]["credit"] - total_t;
            doc[0].save()
                .then(()=>res.json(new_order))
                .catch(err => res.status(400).json('Error: ' + err));
        }
    });
});

router.route('/history/:custphone').get(function(req,res,nxt){
    const cust_phone = req.params.custphone;
    Order.find({'cust_phone': cust_phone},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/add/order/food/:name/:custphone/:res_name').get(async function(req,res,nxt){
    const content = req.params.name;
    const cust_phone = req.params.custphone;
    const res_name = req.params.res_name;
    let food;
    let restaurant;
    await Food.find({'name':content, 'res_name':res_name},function(err,doc){
        if (err)
        return res.status(400).json('Error: ' + err);
        food = doc[0];
    }); 
    await Manager.find({'name':res_name},function(err,doc){
        if (err)
        return res.status(400).json('Error: ' + err);
        restaurant = doc[0];
    }); 
    await Order.find({'res_name':food["res_name"], 'finished':false, 'cust_phone':cust_phone},function(err,doc){
        if (err)
        return res.status(400).json('Error: ' + err);
        if (doc.length === 0){
            let list = [];
            list.push(content);
            const total = food["price"] + restaurant["fee"];
            const manager_accepted = false;
            const pre_delay = food["pre_delay"];
            const sent_delay = restaurant["delay"];
            const finished = false;
            const user_accepted = false;
            const newOrder = new Order({
                total,
                list,
                cust_phone,
                res_name,
                user_accepted,
                manager_accepted,
                pre_delay,
                sent_delay,
                finished,
              });
            
              newOrder.save()
              .then(() => res.json(newOrder))
                .catch(err => res.status(400).json('Error: ' + err));
        }else{
            doc[0]["list"].push(content);
            doc[0]["total"] = doc[0]["total"] + food["price"];
            doc[0]["pre_delay"] = doc[0]["pre_delay"] + food["pre_delay"];
            doc[0].save()
                .then(() => res.json(doc[0]))
                .catch(err => res.status(400).json('Error: ' + err));
        }
        
    });
});

router.route('/order/').post(async function(req,res,nxt){
    const id = req.body.id;
    Order.findById(id,function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/update/order').post((req, res) => {
    Order.findById(req.body.id)
    .then(Order => {
        if (req.body.list) 
            Order.list = req.body.list;
        if (req.body.pre_delay)
            Order.pre_delay = req.body.pre_delay;
        if (req.body.sent_delay)
            Order.sent_delay = req.body.sent_delay;
        if (req.body.finished)
            Order.finished = req.body.finished;
        Order.save()
          .then(() => res.json(Order))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/delete/order/').post(async function(req,res,nxt){
    const id = req.body.id;
    Order.findByIdAndDelete(id,function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/search/restaurant/:name').get(function(req,res,nxt){
    const content = req.params.name;
    Food.find({'res_name':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/search/food/:name').get(function(req,res,nxt){
    const content = req.params.name;
    Food.find({'name':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err);
        return res.json(doc);
    }); 
});

router.route('/search/section/:num').get(async function(req,res,nxt){
    const content = req.params.num;
    var rests = [];
    var foods = [];
    await Manager.find({'section':content},function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
              
        doc.forEach(function(manager,indx){
            rests.push(manager);
        })
    });
    while(rests.length>0){
        await Food.find({'res_name':rests.pop()["name"]}, function(err,doc_2){
            if (err)
                return res.status(400).json('Error: ' + err)
            foods = foods.concat(doc_2);
        })
    }
    
    return res.json(foods);
});

router.route('/comment').post((req, res) => {
    const cust_phone = req.body.cust_phone;
    const res_name = req.body.res_name;
    const food_name = req.body.food_name;
    let content;
    if (req.body.content)
        content = req.body.content;
    else
        content = null;
    let reply;
    if (req.body.reply)
        reply = req.body.reply;
    else
        reply = null;
    let rate;
    if (req.body.rate)
        rate = Number(req.body.rate);
    else
        rate = null;

    const newComment = new Comment({
        cust_phone,
        res_name,
        food_name,
        content,
        reply,
        rate,
    });
    newComment.save()
    .then(() => res.json(newComment))
    .catch(err => res.status(400).json('Error: ' + err));
  });

  router.route('/food').get((req, res) => {
    Food.find({}, function(err,doc){
        if (err)
            res.status(400).json('Error: ' + err)
        return res.json(doc);
    });
    
  });

router.route('/register').post((req, res) => {
  const phonenum = req.body.phonenum;
  const password = req.body.password;
  const name = req.body.name;
  const section = req.body.section;
  const address = req.body.address;
  let credit = Number(req.body.credit);
  const date = Date.parse(req.body.date);
  const this_year = Date.parse("2022-06-18T17:38:13.644Z");
  
  if (date < this_year){
      credit = 1000 + credit;
  }else
  if (Date.now() < this_year){
    credit = 1000 + credit;
  }

  const newCustomer = new Customer({
    phonenum,
    password,
    name,
    section,
    address,
    credit,
    date,
  });

  newCustomer.save()
  .then(() => res.json(newCustomer))
  .catch(err => res.status(400).json('Error: ' + err));
});



router.route('/profile').post((req, res) => {
    const id = req.body.id;
    Customer.findById(id, function(err,doc){
        if (err)
            return res.status(400).json('Error: ' + err)
        return res.json(doc);
    });
    
  });

router.route('/login').post((req, res) => {
    const phonenum = req.body.phonenum;
    const password = req.body.password;
    Customer.find({'phonenum': phonenum}, function(err,doc){
        if (err)
            res.status(400).json('Error: ' + err)
        else if(doc[0]["password"] == password)
            return res.json(doc[0]);
        else 
            return res.json("no match!");

    });
    
  });

router.route('/update').post((req, res) => {
  Customer.findById(req.body.id)
    .then(Customer => {
        if (req.body.password)
            Customer.password = req.body.password;
        if (req.body.name)
            Customer.name = req.body.name;
        if (req.body.section)
            Customer.section = req.body.section;
        if (req.body.address)
            Customer.address = req.body.address;
        if (req.body.credit)
            Customer.credit = Number(req.body.credit);
        if (req.body.date)
            Customer.date = Date.parse(req.body.date);
  
        Customer.save()
          .then(() => res.json(Customer))
          .catch(err => res.status(400).json('Error: ' + err));

    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router; 