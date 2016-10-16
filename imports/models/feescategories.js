export default Feescategories = new Mongo.Collection('feescategories');

Feescategories.allow({
    insert(userId, feescategory){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, feescategory, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, feescategory){
        // permission to remove only to party owner
        return true;
    },

});
