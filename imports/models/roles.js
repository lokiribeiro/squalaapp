export default Roles = new Mongo.Collection('roles');

Roles.allow({
    insert(userId, role){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, role, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, role){
        // permission to remove only to party owner
        return true;
    },

});
