AutoForm.hooks({
	addSetupPrompt: {
		onSuccess: function(formType, result) {
			Router.go('viewSetupPrompts');
		}
	}
});