Meteor.methods({
	setRequiredEquipment: function(assemblyStepId, requiredEquipmentIds) {
		RequiredEquipment.remove({assemblyStepId: assemblyStepId});

		console.log(requiredEquipmentIds);
		for (var i = 0; i < requiredEquipmentIds.length; ++i)
		{
			RequiredEquipment.insert({
				assemblyStepId: assemblyStepId,
				equipmentId: requiredEquipmentIds[i]
			});
		}
	},
	removeEquipment: function(equipmentId) {
		var equipmentUses = RequiredEquipment.find({equipmentId: equipmentId});

		if (equipmentUses.count() > 0)
		{
			var stepList = "";

			equipmentUses.forEach( function(requiredEquipment) {

				var step = AssemblySteps.findOne(requiredEquipment.assemblyStepId);
				var assembly = Assemblies.findOne(step.assemblyId);
				stepList = stepList + "\n" + assembly.name + ": " + step.name;
			});
			
			throw new Meteor.Error("The equipment cannot be deleted. It is being used in the following steps:" + stepList);
		}
		else
		{
			Equipment.remove(equipmentId);
		}
	}
});