Meteor.methods({
	addAssemblyStep: function(assemblyStep, prerequisiteStepIds, stepSetupPromptIds, requiredEquipmentIds) {
		var assemblyStepId = AssemblySteps.insert(assemblyStep);

		Meteor.call('setPrerequisiteSteps', assemblyStepId, prerequisiteStepIds);
		Meteor.call('setStepSetupPrompts', assemblyStepId, stepSetupPromptIds);
		Meteor.call('setRequiredEquipment', assemblyStepId, requiredEquipmentIds);
	},
	setPrerequisiteSteps: function(assemblyStepId, prerequisiteStepIds) {
		PrerequisiteSteps.remove({assemblyStepId: assemblyStepId});
		for (var i = 0; i < prerequisiteStepIds.length; ++i)
		{
			PrerequisiteSteps.insert({
				assemblyStepId: assemblyStepId,
				prerequisiteStepId: prerequisiteStepIds[i]
			});
		}
	},
	removeAssemblyStep: function(assemblyStepId) {
		var assemblyStep = AssemblySteps.findOne({_id: assemblyStepId});
		var prerequisiteSteps = PrerequisiteSteps.find({assemblyStepId: assemblyStep._id});
		var dependentSteps = PrerequisiteSteps.find({prerequisiteStepId: assemblyStep._id});

		var newDependentSteps = [];
		var newPrerequisiteSteps = [];

		dependentSteps.forEach( function(dependentStep) {
			prerequisiteSteps.forEach( function(prerequisiteStep) {
				//adds the prerequisite step of the step that is being deleted to the dependend step of the step being deleted.
				//keeps the chain together
				//however, it only does this if the prerequisite step is not already a prerequisite step for another step.
				var prerequisiteCount = PrerequisiteSteps.find({prerequisiteStepId: prerequisiteStep.prerequisiteStepId}).count();
				if (prerequisiteCount <= 1)
				{
					newDependentSteps.push(dependentStep.assemblyStepId);
					newPrerequisiteSteps.push(prerequisiteStep.prerequisiteStepId);
				}
			});
		});

		for (var i = 0; i < newDependentSteps.length; ++i)
		{
			PrerequisiteSteps.insert({
				assemblyStepId: newDependentSteps[i], 
				prerequisiteStepId: newPrerequisiteSteps[i]
			});
		}

		PrerequisiteSteps.remove({assemblyStepId: assemblyStep._id});
		PrerequisiteSteps.remove({prerequisiteStepId: assemblyStep._id});
		RequiredEquipment.remove({assemblyStepId: assemblyStep._id});
		StepSetupPrompts.remove({assemblyStepId: assemblyStep._id});
		AssemblySteps.remove({_id: assemblyStep._id});
	},
	editAssemblyStep : function(assemblyStep, prerequisiteStepIds, stepSetupPromptIds, requiredEquipmentIds)
	{
		AssemblySteps.update(
			{_id: assemblyStep._id},
			{$set: {
				name: assemblyStep.name,
				walkthroughLink: assemblyStep.walkthroughLink,
				skillRequired: assemblyStep.skillRequired
			}
		});

		Meteor.call('setPrerequisiteSteps', assemblyStep._id, prerequisiteStepIds);
		Meteor.call('setStepSetupPrompts', assemblyStep._id, stepSetupPromptIds);
		Meteor.call('setRequiredEquipment', assemblyStep._id, requiredEquipmentIds);
	}
});