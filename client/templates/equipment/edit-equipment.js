AutoForm.hooks({
	editEquipment: {
		onSuccess: function(formType, result) {
			Router.go('viewEquipment');
		}
	}
});