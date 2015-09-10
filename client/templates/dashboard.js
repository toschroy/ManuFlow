Template.dashboard.helpers({
	activeRunExists: function() {
		return Runs.findOne({active: true}) != null;
	},
	currentUsername: function() {
		return Meteor.user().username;
	}
})