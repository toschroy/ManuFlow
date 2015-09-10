Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function() {
	if (Meteor.userId()) {
		if (Roles.userIsInRole(Meteor.userId(), ['admin']))
			this.render('adminDashboard');
		else
			this.render('dashboard');
	}
	else {
		this.render('home');
	}
}, {name: 'home'});

Router.route('/assemblies', {name: 'viewAssemblies'});
Router.route('/assemblies/:_id', {
	name:'editAssembly',
	data: function() {return Assemblies.findOne(this.params._id); }
});
Router.route('/assemblies/:assemblyId/edit-assembly-step/:_id', {
	name: 'editAssemblyStep',
	data: function() {return AssemblySteps.findOne(this.params._id);}
});
Router.route('/assemblies/:assemblyId/edit-assembly-step/:_id/view-sub-steps', {
	name: 'viewSubSteps',
	data: function() {return AssemblySteps.findOne(this.params._id); }
});
Router.route('/assemblies/edit-assembly-step/:assemblyStepId/edit-sub-step/:_id', {
	name: 'editSubStep',
	data: function() { return SubSteps.findOne(this.params._id); }
});

Router.route('/equipment/add-equipment', {name:'addEquipment'});
Router.route('/equipment', {name: 'viewEquipment'});
Router.route('/equipment/:_id', {
	name: 'editEquipment',
	data : function() {return Equipment.findOne(this.params._id);}
});

Router.route('/view-users', {
	name: 'viewUsers',
	waitOn: function() {
		Meteor.subscribe('users');
	}
});
Router.route('/view-users/:_id', {
	name: 'editUser',
	data: function() {return Meteor.users.findOne(this.params._id)}
});

Router.route('/setup-prompts', {name: 'viewSetupPrompts'});
Router.route('/setup-prompts/add-setup-prompt', {name: 'addSetupPrompt'});
Router.route('/setup-prompts/:_id', {
	name: 'editSetupPrompt',
	data : function() {return SetupPrompts.findOne(this.params._id);}
});

Router.route('/view-runs', {
	name: 'viewRuns'
});

Router.route('/view-runs/new-run', {
	name: 'newRun'
});
Router.route('/veiw-runs/edit-run/:_id', {
	name: 'editRun',
	data: function() {return Runs.findOne(this.params._id);}
});

Router.route('/view-available-steps/', {
	name: 'viewAvailableSteps'
});
Router.route('/view-sub-steps/:_id', {
	name: 'viewRunSubSteps',
	data: function() {return RunSteps.findOne(this.params._id); }
});

