Template.viewAvailableSteps.helpers({
	availableRunSteps: function() {
		return Session.get('availableSteps');
	},
	runStepsAreAvailable: function() {
		try {
			var availableSteps = getAvailableRunSteps()
			Session.set('availableSteps', availableSteps);
			return availableSteps.length > 0;
		}
		catch (error) {
			Router.go('home');
		}
	},
	correspondingAssemblyStep: function (runStep) {
		return AssemblySteps.findOne(runStep.assemblyStepId);
	}
});