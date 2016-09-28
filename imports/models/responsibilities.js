export default Responsibilities = new Mongo.Collection('responsibilities');

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
