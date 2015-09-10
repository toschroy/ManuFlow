Meteor.publish('assembly-steps', function() {
	return AssemblySteps.find();
});
Meteor.publish('assemblies', function() {
	return Assemblies.find();
});
Meteor.publish('prerequisite-steps', function() {
	return PrerequisiteSteps.find();
});
Meteor.publish('setup-prompts', function() {
	return SetupPrompts.find();
});
Meteor.publish('step-setup-prompts', function() {
	return StepSetupPrompts.find();
});
Meteor.publish('equipment', function() {
	return Equipment.find();
});
Meteor.publish('required-equipment', function() {
	return RequiredEquipment.find();
});
Meteor.publish('sub-steps', function() {
	return SubSteps.find();
});
Meteor.publish('users', function() {
	if (Roles.userIsInRole(this.userId, ['admin']))
	{
		return Meteor.users.find();
	}
	else
	{
		this.stop();
		return;
	}
});

Meteor.publish('images', function() {
	return Images.find();
});
Meteor.publish('runs', function() {
	return Runs.find();
});
Meteor.publish('run-steps', function() {
	return RunSteps.find();
});

Equipment.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
Assemblies.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
SetupPrompts.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
Security.permit(['insert', 'update', 'remove']).collections([
	Meteor.users
	]).ifHasRole('admin').apply();
SubSteps.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
Images.allow({
	download: function() {
		return true;
	},
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});