Template.viewAssemblies.events({
	'click .add-assembly': function() {
		var name = prompt("New assembly name:");
		Meteor.call('addAssembly', name);
	},
	'click [name="delete"]': function(event) {
		if (confirmDelete())
			Meteor.call('removeAssembly', event.target.id);

		event.preventDefault();
	}
});

Template.viewAssemblies.helpers({
	getAssemblies: function() {
		return Assemblies.find({}, {sort: {name: 1}});
	}
});