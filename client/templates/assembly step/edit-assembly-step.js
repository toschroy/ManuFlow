var editing = function() {
	return Router.current().params._id != "null";
}

var showTakenPrerequisites = false;

Template.editAssemblyStep.helpers({
	availablePrerequisiteList: function() {
		var assemblyStepList = AssemblySteps.find({assemblyId: Router.current().params.assemblyId});
		var availablePrerequisites = [];
		var currentId = Router.current().params._id;

		assemblyStepList.forEach( function(step) {
			if (PrerequisiteSteps.findOne({prerequisiteStepId: step._id}) == null) {
				if (step._id != currentId) {
					availablePrerequisites.push(step);
				}
			}
		});
		return availablePrerequisites;
	},
	selectedPrerequisiteList: function() {
		return PrerequisiteSteps.find({
			assemblyStepId: Router.current().params._id
		});
	},
	getPrerequisiteName: function(prerequisiteStepId) {
		var assemblyStep = AssemblySteps.findOne({_id: prerequisiteStepId});
		return assemblyStep.name;
	},
	equipment: function() {
		return Equipment.find();
	},
	setupPrompts: function() {
		return SetupPrompts.find();
	},
	equipmentIsRequired: function() {
		if (editing())
		{
			var requiredEquipment = RequiredEquipment.findOne({
				assemblyStepId: Router.current().params._id,
				equipmentId: this._id
			});

			return requiredEquipment != null;
		}
		else
			return false;
	},
	selectedSetupPrompt: function() {
		if (editing())
		{
			var stepSetupPrompt = StepSetupPrompts.findOne({
				assemblyStepId: Router.current().params._id,
				setupPromptId: this._id
			});

			return stepSetupPrompt != null;
		}
		else
			return false;
	},
	getSelectedList: function(listBoxName) {
		var selectedList = [];
		var listBox = document.getElementById(listBoxName);

		for (var i = 0; i < listBox.selectedOptions.length; ++i)
		{
			selectedList.push(listBox.selectedOptions[i].value);
		}

		return selectedList;
	}
});

Template.editAssemblyStep.events({
	'click #showTakenPrerequisites': function(event) {
		showTakenPrerequisites = event.target.checked;

		var assemblySteps = null;
		var getPrerequisiteName = Template.editAssemblyStep.__helpers.get('getPrerequisiteName');
		var availablePrerequisiteList = Template.editAssemblyStep.__helpers.get('availablePrerequisiteList');
		var listBox = document.getElementById('prerequisitesListBox');

		for (var i = listBox.options.length - 1; i >= 0; --i) {
			if (listBox.options[i].selected == false)
			{
				listBox.options.remove(i);
			}
		}
		if (showTakenPrerequisites)
		{
			assemblySteps = AssemblySteps.find({assemblyId: Router.current().params.assemblyId}).fetch();
		}
		else
		{
			assemblySteps = availablePrerequisiteList();
		}

		for (var n = 0; n < assemblySteps.length; ++n)
		{
			step = assemblySteps[n];
			var foundDuplicate = false;
			var i = 0;

			while (i < listBox.selectedOptions.length && foundDuplicate == false)
			{
				if (listBox.selectedOptions[i].value == step._id || step._id == Router.current().params._id)
				{
					foundDuplicate = true;
				}
				++i;
			}

			if (!foundDuplicate)
			{
				var option = document.createElement('option');
				option.value = step._id;
				option.text = step.name;
				listBox.options.add(option);
			}
		}

		prerequisitesListBox.bootstrapDualListbox('refresh', true);
	},
	'submit .edit-step': function(event) {
		event.preventDefault();
		var getSelectedList = Template.editAssemblyStep.__helpers.get('getSelectedList');
		
		var assemblyStep = {
			name: event.target.assemblyName.value,
			assemblyId: Router.current().params.assemblyId,
			skillRequired: event.target.skillRequired.value
		};

		var prerequisiteStepIds = getSelectedList('prerequisitesListBox');
		var stepSetupPromptIds = getSelectedList('setupPromptsListBox');
		var requiredEquipmentIds = getSelectedList('equipmentListBox');

		if (editing())
		{
			assemblyStep._id = Router.current().params._id;
			Meteor.call('editAssemblyStep', assemblyStep, prerequisiteStepIds, stepSetupPromptIds, requiredEquipmentIds, function(result, error) {
				Router.go('editAssembly', {_id: Router.current().params.assemblyId});
			});
		}
		else
		{
			Meteor.call('addAssemblyStep', assemblyStep, prerequisiteStepIds, stepSetupPromptIds, requiredEquipmentIds, function(result, error) {
				Router.go('editAssembly', {_id: Router.current().params.assemblyId});
			});
		}
	}
});