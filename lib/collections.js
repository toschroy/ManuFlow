Assemblies = new Mongo.Collection('assemblies');
AssemblySteps = new Mongo.Collection('assembly-steps');
PrerequisiteSteps = new Mongo.Collection('prerequisite-steps');
RequiredEquipment = new Mongo.Collection('required-equipment');
Equipment = new Mongo.Collection('equipment');
SetupPrompts = new Mongo.Collection('setup-prompts');
StepSetupPrompts = new Mongo.Collection('step-setup-prompts');
SubSteps = new Mongo.Collection('sub-steps');

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {})],
  filter: {
  	allow: {
  		contentTypes: ['image/*']
  	}
  }
});

Runs = new Mongo.Collection('runs');
RunSteps = new Mongo.Collection('run-steps');

var Schemas = {};

Schemas.Assembly = new SimpleSchema({
	name: {
		type: String,
		label: 'Name'
	}
});

Schemas.AssemblyStep = new SimpleSchema({
	name: {
		type: String,
		label: 'Name'
	},
	assemblyId: {
		type: String
	},
	skillRequired: {
		type: Number,
		label: 'Skill Required',
		min: 1,
		max: 5,
		defaultValue: 1
	}
});

Schemas.SubStep = new SimpleSchema({
	description: {
		type: String,
		label: 'Description',
	},
	pictures: {
		type: [String],
		label: 'Choose Image',
		optional: true
	},
	"pictures.$": {
		autoform: {
			afFieldInput: {
				type: 'fileUpload',
				collection: 'Images',
				accept: 'image/*'
			}
		}
	},
	assemblyStepId: {
		type: String,
		autoform: {
			omit: true
		}
	},
	order: {
		type: Number,
		label: 'Order'
	}
});

Schemas.UserProfile = new SimpleSchema({
	firstName: {
		type: String,
		regEx: /^[a-zA-Z-]{2,25}$/,
        optional: true,
        label: 'First Name'
	},
	lastName: {
        type: String,
        regEx: /^[a-zA-Z]{2,25}$/,
        optional: true,
        label: 'Last Name'
    },
    skillLevel: {
    	type: Number,
    	label: 'Skill Level',
    	optional: true,
    	min: 1,
    	max: 5,
    	defaultValue: 1
    }
});

Schemas.Run = new SimpleSchema({
	name: {
		type: String,
		label: 'Name'
	},
	quantity: {
		type: Number,
		label: 'Quantity',
		min: 1
	},
	assemblyId: {
		type: String,
		label: 'Assembly',
		autoform: {
			options: function() {
				return Assemblies.find().map( function(assembly) {
					return {
						label: assembly.name,
						value: assembly._id
					}
				});
			}
		}
	},
	active: {
		type: Boolean,
		autoform: {
			omit: true
		},
		defaultValue: false
	}
});

Schemas.RunStep = new SimpleSchema({
	assemblyStepId: {
		type: String
	},
	runId: {
		type: String
	},
	status: {
		type: String,
		allowedValues: ['notStarted', 'incomplete', 'inProgress', 'completed'],
		defaultValue: 'notStarted'
	},
	userId: {
		type: String,
		optional: true,
	}
});

Schemas.User = new SimpleSchema({
	_id: {
		type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoform: {
        	omit: true
        }
	},
	username: {
		type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        autoform: {
        	omit: true
        }
    },
    profile: {
    	type: Schemas.UserProfile,
    	optional: true
    },
    roles: {
        type: [String],
        allowedValues: ['assembly','admin'],
        autoform: {
        	options: [
        		{label: 'Assembly', value: 'assembly'},
        		{label: 'Admin', value: 'admin'}
        	]
        },
        defaultValue: ['assembly']
    },
    services: {
    	type: Object,
    	blackbox: true,
    	autoform: {
    		omit: true
    	}
    }
});

Schemas.PrerequisiteStep = new SimpleSchema({
	assemblyStepId: {type: String},
	prerequisiteStepId: {type: String}
});

Schemas.RequiredEquipment = new SimpleSchema({
	assemblyStepId: {type: String},
	equipmentId: {type: String}
});

Schemas.SetupPrompts = new SimpleSchema({
	description: {
		type: String,
		label: 'Description'
	}
});

Schemas.StepSetupPrompt = new SimpleSchema({
	assemblyStepId: {
		type: String,
		autoform: {
			omit: true
		}
	},
	setupPromptId: {
		type: String,
		autoform: {
			options: function() {
				return SetupPrompts.find().map( function(setupPrompt) {
					return {
						label: setupPrompt.description,
						value: setupPrompt._id
					}
				});
			}
		}
	}
});

Schemas.Equipment = new SimpleSchema({
	name: {
		type: String,
		label: 'Equipment Type'
	},
	quantity: {
		type: Number,
		label: 'Quantity',
		min: 1,
		max: 50
	}
});

AssemblySteps.attachSchema(Schemas.AssemblyStep, {transform: true});
PrerequisiteSteps.attachSchema(Schemas.PrerequisiteStep, {transform: true});
Equipment.attachSchema(Schemas.Equipment, {transform: true});
RequiredEquipment.attachSchema(Schemas.RequiredEquipment, {transform: true});
SetupPrompts.attachSchema(Schemas.SetupPrompts, {transform: true});
StepSetupPrompts.attachSchema(Schemas.StepSetupPrompt, {transform: true});
SubSteps.attachSchema(Schemas.SubStep, {transform: true});
Assemblies.attachSchema(Schemas.Assembly, {transform: true});
Runs.attachSchema(Schemas.Run, {transform: true});
Meteor.users.attachSchema(Schemas.User);