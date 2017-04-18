import Classlists from '/imports/models/classlists.js';

Classlists.allow({
    insert(userId, classlist){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, classlist, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, classlist){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('classlists', function () {
  var selector = {};
  return Classlists.find(selector);
});

/*Meteor.methods({

upsertclasslistFromAdmin(classlistName, classlistDel){
  var selector = {_id: classlistDel};
  var modifier = {$set: {classlist: classlistName}};
  var userUpsert = classlists.update(selector, modifier);
  return userUpsert;
}
})*/
