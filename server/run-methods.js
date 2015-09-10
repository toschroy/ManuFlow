Meteor.methods({
	addNewRun: function(newRun) {
		var newRunId = Runs.insert(newRun);

		var assembly = Assemblies.findOne(newRun.assemblyId);
		var assemblySteps = AssemblySteps.find({assemblyId: assembly._id});

		assemblySteps.forEach( function(assemblyStep) {
			RunSteps.insert({
				assemblyStepId: assemblyStep._id,
				runId: newRunId,
				status: 'notStarted'
			});
		});
	},
	removeRun: function(runId) {
		var run = Runs.findOne(runId);
		if (!run.active) {
			RunSteps.remove({runId: run._id});
			Runs.remove(run);
		}
		else {
			throw new Meteor.Error("The run " + run.name + " is currently in progress and cannot be deleted.");
		}
	},
	activateRun: function(runId) {
		//does not check to see if the run is currently being worked on by an assembly user. need to fx
		Runs.update({active: true}, {$set: {active: false}});
		Runs.update(runId, {$set: {active: true}});
	},
	pauseRun: function(runId) {
		Runs.update(runId, {$set: {active: false}});
	},
	//takes an assembly step id, not a run step id.
	setStepCompleted: function(runStepId) {
		RunSteps.update(runStepId, {$set: {status: 'completed'}});

		var runStep = RunSteps.findOne(runStepId);
		Meteor.call('checkRunCompleted', runStep.runId);
	},
	checkRunCompleted: function(runId) {
		var completedSteps = RunSteps.find({runId: runId, status: 'completed'});
		var totalSteps = RunSteps.find({runId: runId});

		if (completedSteps.count() >= totalSteps.count())
			Runs.update(runId, {$set: {active: false}});
	},
	setStepInProgress: function(runStepId, userId) {
		RunSteps.update(runStepId, {$set: {
			status: 'inProgress',
			userId: userId
		}});
	},
	setStepIncomplete: function(runStepId) {
		RunSteps.update(runStepId, {$set: {status: 'incomplete'}});
	},
	browserClose: function() {
		RunSteps.update({status: 'inProgress', userId: this.userId}, {$set: {status: 'incomplete'}});
		console.log('inProgress to incomplete');
	}
});