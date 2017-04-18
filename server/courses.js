import Courses from '/imports/models/courses.js';

Courses.allow({
    insert(userId, course){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, course, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, course){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('courses', function () {
  var selector = null;
  selector = {};
  return Courses.find(selector);
});

Meteor.publish('courses2', function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {_id: selector};
    }

    return Courses.find(selector);
});

Meteor.publish('courseslist', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { coursename: searchString };
      //return Meteor.users.find(selector);
  }else{
    selector = {};

  }
  return Courses.find(selector);
});


Meteor.methods({

/*upsertcourseFromAdmin(courseName, courseDel){
  var selector = {_id: courseDel};
  var modifier = {$set: {course: courseName}};
  var userUpsert = Courses.update(selector, modifier);
  return userUpsert;
}*/
deleteCourse(courseDel){  
  var status = Courses.remove({_id: courseDel});
  return status;
}
})
