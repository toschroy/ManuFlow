Meteor.methods({
	addAssembly: function(name) {
		Assemblies.insert({name: name});
	},
	removeAssembly: function(assemblyId) {
		AssemblySteps.remove({assemblyId: assemblyId});
		Assemblies.remove(assemblyId);
	}
});