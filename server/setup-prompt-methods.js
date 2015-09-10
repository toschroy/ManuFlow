Meteor.methods({
	setStepSetupPrompts: function(assemblyStepId, stepSetupPromptIds) {
		StepSetupPrompts.remove({assemblyStepId: assemblyStepId});
		for (var i = 0; i < stepSetupPromptIds.length; ++i)
		{
			StepSetupPrompts.insert({
				assemblyStepId: assemblyStepId,
				setupPromptId: stepSetupPromptIds[i]
			});
		}
	},
	addStepSetupPrompt: function(stepSetupPrompt) {
		//check(stepSetupPrompt);
		StepSetupPrompts.insert(stepSetupPrompt);
	},
	removeStepSetupPrompt: function(stepSetupPromptId) {
		StepSetupPrompts.remove(stepSetupPromptId);
	},
	removeSetupPrompt: function(setupPromptId) {
		var stepSetupPrompts = StepSetupPrompts.find({setupPromptId: setupPromptId});

		if (stepSetupPrompts.count() > 0)
		{
			var stepList = "";

			stepSetupPrompts.forEach( function(stepSetupPrompt) {

				var step = AssemblySteps.findOne(stepSetupPrompt.assemblyStepId);
				var assembly = Assemblies.findOne(step.assemblyId);
				stepList = stepList + "\n" + assembly.name + ": " + step.name;
			});
			
			throw new Meteor.Error("The setup prompt cannot be deleted. It is being used in the following steps:" + stepList);
		}
		else
		{
			SetupPrompts.remove(setupPromptId);
		}
	}
})