
 Accounts.onLogin(function() {
 	Router.go('home');
 	// Meteor.call('isAdmin', function(error, result) {
	 // 	if (result)
	 //        Router.go('adminDashboard');
	 //    else
	 //        Router.go('dashboard');
 	// });
});