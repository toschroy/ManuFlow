Template.viewRuns.helpers({
	getRuns: function() {
		return Runs.find();
	},
	assemblyName: function() {
		var assembly = Assemblies.findOne(this.assemblyId);
		return assembly.name;
	},
	runNotCompleted: function() {
		return !runIsCompleted(this._id);
	},
	completedSteps: function() {
		return RunSteps.find({
			runId: this._id,
			status: 'completed'
		}).count();
	},
	totalSteps: function() {
		return RunSteps.find({runId: this._id}).count();
	}
});

Template.viewRuns.onRendered(function() {
	var mainButtons = document.getElementsByClassName('main-button');
	console.log(mainButtons[0].style.height);
});

Template.viewRuns.events({
	'click .new-run': function(event) {
		Router.go('newRun');
	},
	'click [name="delete"]': function(event) {
		if (confirmDelete()) {
			Meteor.call('removeRun', event.target.id, function(error) {
				if (error) {
					alert(error);
				}
			});
		}

		event.preventDefault();
	},
	'click [name="activate"]': function(event) {
		Meteor.call('activateRun', event.target.id);
		event.preventDefault();
	},
	'click [name="pause"]': function(event) {
		Meteor.call('pauseRun', event.target.id);
		event.preventDefault();
	}
});

AutoForm.hooks({
	newRunForm: {
		onSuccess: function(formType, result) {
			Meteor.call('setupNewRun', result, function() {
				Router.go('viewRuns');
			});
		}
	}
});