Template.viewRunSubSteps.events({
	'click .next': function(event) {
		Meteor.call('setStepCompleted', Router.current().params._id, function(error, result) {
			Router.go('viewAvailableSteps');
		});
	},
	'click .cancel': function(event) {
		Meteor.call('setStepIncomplete', this._id, function(error, result) {
			Router.go('viewAvailableSteps');
		});
		
	}
});

Template.viewRunSubSteps.onCreated(function() {
	Meteor.call('setStepInProgress', Template.currentData()._id, Meteor.userId());
});

Template.viewRunSubSteps.onDestroyed(function() {
	if (!stepIsCompleted(Template.currentData())) {
			Meteor.call('setStepIncomplete', Template.currentData()._id);
	}
});

Template.viewRunSubSteps.helpers({
	getSubSteps: function() {
		var assemblyStep = AssemblySteps.findOne(this.assemblyStepId);
		return SubSteps.find({assemblyStepId: assemblyStep._id}, {sort: {order: 1}});
	},
	getImages: function(subStep) {
		var images = [];

		
		if (subStep.pictures)
		{
			for (var i = 0; i < subStep.pictures.length; ++i) {
				images.push(Images.findOne(subStep.pictures[i]));
			}
		}

		return images;
	},
	getSetupPrompts: function() {
		var assemblyStep = AssemblySteps.findOne(this.assemblyStepId);
		var stepSetupPrompts = StepSetupPrompts.find({assemblyStepId: assemblyStep._id});
		var setupPrompts = [];

		stepSetupPrompts.forEach( function(stepSetupPrompt) {
			var setupPrompt = SetupPrompts.findOne(stepSetupPrompt.setupPromptId);
			setupPrompts.push(setupPrompt);
		});

		return setupPrompts;
	}
});