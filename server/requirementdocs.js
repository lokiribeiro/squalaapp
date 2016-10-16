import Requirementdocs from '/imports/models/requirementdocs.js';

Requirementdocs.allow({
    insert(userId, requirementdoc){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, requirementdoc, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, requirementdoc){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('requirementdocs', function () {
  var selector = {};

  return Requirementdocs.find(selector);
});


Meteor.methods({

  upsertRequirementdocs(reqID, newReq){
    var selector = {_id: reqID};
    var modifier = {$set: {
      requirementname: newReq
    }};
    var respUpsert = Requirementdocs.upsert(selector, modifier);
    return respUpsert;
  }

});
