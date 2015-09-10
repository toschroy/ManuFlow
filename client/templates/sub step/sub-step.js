Template.viewSubSteps.helpers({
	getSubSteps: function() {
		return SubSteps.find({assemblyStepId: this._id}, {sort: {order: 1}});
	},
	getSetupPrompts: function() {
		return StepSetupPrompts.find({assemblyStepId: this._id});
	},
	getSetupPrompt: function(setupPromptId) {
		return SetupPrompts.findOne(setupPromptId);
	}
});

Template.viewSubSteps.events({
	'click [name="delete"]': function(event) {
		if (confirmDelete())
		{
			SubSteps.remove(event.target.id);
		}
		event.preventDefault();
	},
	'click [name="delete-prompt"]': function(event) {
		Meteor.call('removeStepSetupPrompt', event.target.id);
	}
});

AutoForm.hooks({
	addSubStepForm: {
		formToDoc: function(subStep) {
			subStep.assemblyStepId = Router.current().params._id;
			subStep.order = SubSteps.find({assemblyStepId: Router.current().params._id}).count() + 1;
			return subStep;
		},
		onSuccess: function(formType, result) {
			this.resetForm();
		}
	},
	addSetupPromptForm: {
		formToDoc: function(stepSetupPrompt) {
			stepSetupPrompt.assemblyStepId = Router.current().params._id;
			return stepSetupPrompt;
		}
	}
});