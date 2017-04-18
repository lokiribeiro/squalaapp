export default Feesuploads = new Mongo.Collection('feesuploads');

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
