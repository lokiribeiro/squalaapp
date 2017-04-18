import Feesuploads from '/imports/models/feesuploads.js';

Feesuploads.allow({
    insert(userId, feesupload){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, feesupload, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, feesupload){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('feesuploads', function () {
  //var profileID = search;
  var selector = {};

  return Feesuploads.find(selector);
});

Meteor.methods({

upsertFilesFromCollect(filename, downloadUrl, date){
  var selector = {date: date};
  var modifier = {$set: {
                        filename: filename,
                        downloadUrl: downloadUrl,
                        date: date
                      }
                  };
  var userUpsert = Feesuploads.upsert(selector, modifier);
  return userUpsert;
}
})
