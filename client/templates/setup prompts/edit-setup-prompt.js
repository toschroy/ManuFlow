AutoForm.hooks({
	editSetupPrompt: {
		onSuccess: function(formType, result) {
			Router.go('viewSetupPrompts');
		}
	},
});
