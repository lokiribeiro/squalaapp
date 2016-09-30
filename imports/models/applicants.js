export default Applicants = new Mongo.Collection('applicants');

Applicants.allow({
    insert(userId, applicant){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, applicant, appId){
        // permission to update only to party owner
        return true;
    },
    remove(userId, applicant){
        // permission to remove only to party owner
        return true;
    },

});
