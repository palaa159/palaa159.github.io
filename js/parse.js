var DB = {};

DB.main = (function() {
	var appId, jsId;
	Parse.initialize('DQpGsaptSZnkCa2XtI22Tw5Jr3arpIO89WRQQogo', 'PrwJp85MWFh6sc1MrNWPc2qjHN9SEt7EJIqynRrZ');
	var Projects = Parse.Object.extend('project');
	var query = function() {
		var q = new Parse.Query(Projects);
		q.find({
			success: function(results) {
				// console.log(results);
				var e = $.Event('qSuccess');
				e.projects = results;
				data = e.projects;
				$(window).trigger(e);
			}
		});
	};

	return {
		query: query
	};
})();