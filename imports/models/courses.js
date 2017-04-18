export default Courses = new Mongo.Collection('courses');

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
