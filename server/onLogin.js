/**
 * Created by robroy on 9/5/15.
 */
Accounts.onCreateUser(function(options, user) {
    var found_admin = Meteor.users.findOne({roles: ['admin']});

    if( found_admin == null)
    {
        user.roles = ['admin'];
        Roles.addUsersToRoles(user._id, user.roles);
    }

    return user;
});

Meteor.methods({
    isAdmin: function() {
        return Roles.userIsInRole(Meteor.user(), ['admin']);
    }
});