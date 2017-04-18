import Lessonguides from '/imports/models/lessonguides.js';

Lessonguides.allow({
    insert(userId, lessonguide){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, lessonguide, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, lessonguide){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('lessonguides', function () {
  var selector = null;
  selector = {};
  return Lessonguides.find(selector);
});


Meteor.methods({

upsertLessonguide(courseName, courseDel){
  var selector = {_id: courseDel};
  var modifier = {$set: {course: courseName}};
  var userUpsert = Courses.update(selector, modifier);
  return userUpsert;
},
deleteLessonguide(courseDel){
  var status = Lessonguide.remove({_id: courseDel});
  return status;
}
})
