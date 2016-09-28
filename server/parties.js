import Parties from '/imports/models/parties.js';

Parties.allow({
    insert(userId, party){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, party, fieldNames, modifier){
        // permission to update only to party owner
        return userId && party.ownerId === userId;
    },
    remove(userId, party){
        // permission to remove only to party owner
        return userId && party.ownerId === userId;
    },

});

Meteor.publish('parties', function (searchText) {
    var selector = null;
    if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {name: searchString, $or: [
            {public: true},
            {ownerId: this.userId},
            {'invitedUsers.userId': this.userId}
        ]};
    }else{
        selector = {$or: [
            {public: true},
            {ownerId: this.userId},
            {'invitedUsers.userId': this.userId}
        ]};
    };
    return Parties.find(selector);
});

Meteor.methods({

    invite(user, party){
        var invitedUsers = party.invitedUsers;
        Parties.update( {_id: party._id}, {$addToSet: {invitedUsers: {
                userId: user._id,
                assistance: false,
                email: user.emails[0].address,
                responded: false
            }
        }});
    },

    uninvite(userId, party){
        Parties.update( {_id: party._id}, {$pull: {invitedUsers: {userId: userId} } } );
    },

    acceptInvitation(userId, party){
        var invitedUsers = party.invitedUsers;
        var invitedUser = _.findWhere( invitedUsers, {userId: userId} );
        if(!invitedUser){
            throw new Meteor.Error("Error accepting invitation. User not invited");
        };
        invitedUser.assistance = true;
        invitedUser.responded = true;
        Parties.update({_id: party._id}, {$set: {invitedUsers: invitedUsers}});
    },

    denyInvitation(userId, party){
        var invitedUsers = party.invitedUsers;
        var invitedUser = _.findWhere( invitedUsers, {userId: userId} );
        if(!invitedUser){
            throw new Meteor.Error("Error Denying invitation. User not invited");
        };
        invitedUser.assistance = false;
        invitedUser.responded = true;
        Parties.update({_id: party._id}, {$set: {invitedUsers: invitedUsers}});
    }

})

