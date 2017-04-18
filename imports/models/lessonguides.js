export default Lessonguides = new Mongo.Collection('lessonguides');

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
