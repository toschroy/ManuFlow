AutoForm.hooks({
	editSubStepForm: {
		onSuccess: function(formType, result) {
			var assemblyStep = AssemblySteps.findOne(Router.current().params.assemblyStepId);
			Router.go('viewSubSteps', {assemblyId: assemblyStep.assemblyId, _id: assemblyStep._id});
		}
	}
});