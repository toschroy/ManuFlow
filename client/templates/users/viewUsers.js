Template.viewUsers.helpers({
	getUsers: function() {
		return Meteor.users.find();
	}
});

Template.viewUsers.events({
	'click [name="delete"]': function(event) {
		if (confirmDelete()) {
			Meteor.users.remove(event.target.id);
			event.preventDefault();
		}
	}
});