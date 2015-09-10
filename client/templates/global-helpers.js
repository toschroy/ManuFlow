confirmDelete = function() {
	var str = prompt('Are you sure? Type "delete" to confirm.');
		if (str == "delete")
			return true;
		else
			return false;
}

Meteor.startup(function() {
	$(window).bind('beforeunload', function() {
		browserClose();
		return null;
	});
});

browserClose = function() {
	Meteor.call('browserClose');
}