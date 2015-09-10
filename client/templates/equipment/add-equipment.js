AutoForm.hooks({
	addEquipment: {
		onSuccess: function(formType, result) {
			Router.go('viewEquipment');
		}
	}
});