export default Classlists = new Mongo.Collection('classlists');

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
