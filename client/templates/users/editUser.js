AutoForm.hooks({
	editUserForm: {
		onSuccess: function(formType, result) {
			Router.go('viewUsers');
		}
	}
})