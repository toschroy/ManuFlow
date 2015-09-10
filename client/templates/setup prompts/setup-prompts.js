Template.viewSetupPrompts.helpers({
	setupPrompts: function() {
		return SetupPrompts.find();
	}
});

Template.viewSetupPrompts.events({
	'click .add-setup-prompt': function() {
		Router.go('addSetupPrompt');
	},
	'click [name="delete"]': function() {
		if (confirmDelete()) {
			Meteor.call('removeSetupPrompt', event.target.id, function(error) {
				if (error) {
					alert(error);
				}
			});
		}
		event.preventDefault();
	}
});