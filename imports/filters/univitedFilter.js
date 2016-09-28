import {app} from '/client/app.js';

app.filter('uninvitedFilter', function () {
    'ngInject';

    return function (users, party) {

        if(!party || !users){
            return;
        }

        var isOwner = function (user, party) {
            return user._id === party.ownerId;
        };

        var isInvited = function (user, party) {
            // No need to install underscore. It is installed by default in meteor 1.3
            var isInvited = _.findWhere( party.invitedUsers, {userId: user._id} ) != null ;
            return isInvited;
        };

        return users.filter(function (user) {
            return !isOwner(user, party) && !isInvited(user, party);
        })
    }
});