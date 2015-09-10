Template.editAssembly.events({
	'click .add-step': function() {
		Router.go('editAssemblyStep', {assemblyId: this._id, _id: null});
	},
	'click [name="delete"]': function(event) {
		Session.set('deleting', true);
		if(confirmDelete())
			Meteor.call('removeAssemblyStep', event.target.id);
	},
	'click .list-group-item': function(event) {
		if (Session.get('deleting')) {
			event.preventDefault();
		}
		
		Session.set('deleting', false);
	},
	'click .sub-steps': function(event) {
		Session.set('deleting', true);
		event.preventDefault();

		Router.go('viewSubSteps', {
			assemblyId: this.assemblyId,
			_id: this._id
		});
	}
});

Template.editAssembly.helpers({
	assemblyStepList : function() {
		Session.set('assemblyId', this._id);
		return AssemblySteps.find({assemblyId: this._id});
	},
	prerequisiteStepList: function() {
		var prerequisiteSteps = PrerequisiteSteps.find({assemblyStepId: this._id});
		var str = "";
		prerequisiteSteps.forEach( function(step) {
			if (str != "") {
				str = str + ", "
			}

			var assemblyStep = AssemblySteps.findOne(step.prerequisiteStepId);
			str = str + assemblyStep.name;
		});
		return str;
	},
	numberOfSubSteps: function() {
		return SubSteps.find({assemblyStepId: this._id}).count();
	}
});