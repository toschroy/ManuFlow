Template.viewEquipment.events({
	'click .add-equipment': function() {
		Router.go('addEquipment');
	},
	'click [name="delete"]': function(event) {
		if (confirmDelete()) {
			Meteor.call('removeEquipment', event.target.id, function(error) {
				if(error) {
					alert(error);
				}
			});
		}
		event.preventDefault();
	}
});

Template.viewEquipment.helpers({
	equipment: function() {
		return Equipment.find();
	}
});