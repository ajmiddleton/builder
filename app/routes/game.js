'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var treeHelper = require('../lib/tree-helper');
var _ = require('lodash');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username:user.username}, (e, rec)=> rec ? res.send(rec) : users.save(user, (e, obj)=>res.send(obj)));
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;
  trees.save(tree, (e, o)=>{
    res.render('game/tree', {tree:o, treeHelper: treeHelper}, (e, html)=> res.send(html));
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  trees.find({userId:userId}).toArray((e, records)=>{
    res.render('game/forest', {trees:records, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (e, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0, 100) !== 70;
    trees.save(tree, (e, count)=>{
      res.render('game/tree', {tree:tree, treeHelper: treeHelper}, (e, html)=>res.send(html));
    });
  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (e, tree)=>{
    users.findOne({_id:tree.userId}, (e, user)=>{
      user.wood += tree.height / 2;
      users.save(user, ()=>{});
      tree.height = -1;
      trees.save(tree, ()=>{
        res.render('game/tree', {tree:tree, treeHelper:treeHelper}, (e, html)=>{
          res.send({user:user, treeHTML: html});
        });
      });
    });
  });
};

exports.sellWood = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  users.findOne({_id:userId}, (e, user)=>{
    if(user.wood >4){
      user.wood -= 5;
      user.cash++;
    }
    users.save(user, ()=>res.send(user));
  });
};
