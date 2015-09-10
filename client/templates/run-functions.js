getAvailableRunSteps = function() {
	var activeRun = Runs.findOne({active: true});
	var availableRunSteps = [];

	if (activeRun) {
		var runSteps = RunSteps.find({runId: activeRun._id});

		runSteps.forEach( function(runStep) {
			if (runStepIsAvailable(runStep)) {
				availableRunSteps.push(runStep);
			}
		});
	}
	else {
		throw new Meteor.Error("There is currently no active run.")
	}

	return availableRunSteps;
}

stepIsCompleted = function(runStep) {
	return runStep.status == "completed";
}

stepIsInProgress = function(runStep) {
	return runStep.status == "inProgress";
}

stepHasNotStarted = function(runStep) {
	return runStep.status == "notStarted";
}

stepIsIncomplete = function(runStep) {
	return runStep.status == "incomplete";
}

runIsActive = function() {
	return Runs.findOne({active: 'true'}) != null;
}

runIsCompleted = function(runId) {
	var completedSteps = RunSteps.find({runId: runId, status: 'completed'});
	var totalSteps = RunSteps.find({runId: runId});

	return completedSteps.count() >= totalSteps.count();
}

equipmentIsAvailable = function(assemblyStep) {
	requiredEquipment = RequiredEquipment.find({assemblyStepId: assemblyStep._id});
	inProgressSteps = RunSteps.find({status: 'inProgress'});
	var available = true;

	requiredEquipment.forEach( function(i) {
		var equipment = Equipment.findOne(i.equipmentId);

		inProgressSteps.forEach( function(n) {
			var inProgressAssemblyStep = AssemblySteps.findOne(n.assemblyStepId);

			var equipmentOverlap = RequiredEquipment.find({
				assemblyStepId: inProgressAssemblyStep._id,
				equipmentId: equipment._id
			} );
			
			if (equipmentOverlap.count() >= equipment.quantity) {
				available = false;
			}
		});
	});

	return available;
}

var skillLevelIsHighEnough = function(skillLevel, skillRequired) {
	return skillLevel >= skillRequired;
}

var runStepIsAvailable = function(runStep) {
	//is the runstep completed
	if (stepHasNotStarted(runStep) || stepIsIncomplete(runStep)) {
		var assemblyStep = AssemblySteps.findOne(runStep.assemblyStepId);

		//is the step at or beneath the users skill level
		if (skillLevelIsHighEnough(Meteor.user().profile.skillLevel, assemblyStep.skillRequired) && equipmentIsAvailable(assemblyStep)) {

			//get a list of all prerequisite steps for the runstep
			var prerequisiteSteps = PrerequisiteSteps.find({assemblyStepId: assemblyStep._id});
			var allPrerequisiteStepsCompleted = true;

			//iterate through the runsteps prerequisite steps to see if they have been completed
			prerequisiteSteps.forEach( function(prerequisiteStep) {
				if (allPrerequisiteStepsCompleted) {
					var prerequisiteRunStep = RunSteps.findOne({assemblyStepId: prerequisiteStep.prerequisiteStepId, runId: runStep.runId});
					allPrerequisiteStepsCompleted = stepIsCompleted(prerequisiteRunStep);
				}
			});

			return allPrerequisiteStepsCompleted;
		}
		else 
			return false;
	}
	else
		return false;
}