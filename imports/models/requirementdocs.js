export default Requirementdocs = new Mongo.Collection('requirementdocs');

Requirementdocs.allow({
    insert(userId, requirementdoc){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, requirementdoc, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, requirementdoc){
        // permission to remove only to party owner
        return true;
    },

});
