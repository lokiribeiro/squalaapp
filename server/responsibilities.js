import Responsibilities from '/imports/models/responsibilities.js';

Responsibilities.allow({
    insert(userId, responsibility){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, responsibility, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, responsibility){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('responsibilities', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { responsibilityname: searchString };
  }else{
    selector = {};

  }
  return Responsibilities.find(selector);
});


Meteor.methods({

  upsertResponsibilityFromAdmin(respID, newResp){
    var selector = {_id: respID};
    var modifier = {$set: {
      responsibilityname: newResp
    }};
    var respUpsert = Responsibilities.upsert(selector, modifier);
    return respUpsert;
  }

});
