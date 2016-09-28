export default Userapps = new Mongo.Collection('userapps');

//Parties.allow({
//    insert(userId, party){
//        // permission to insert only to authenticated users
//        return userId !== null;
//    },
//    update(userId, party, fieldNames, modifier){
//        // permission to update only to party owner
//        return userId && party.ownerId === userId;
//    },
//    remove(userId, party){
//        // permission to remove only to party owner
//        return userId && party.ownerId === userId;
//    },
//
//});
