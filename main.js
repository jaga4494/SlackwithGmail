var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var github = require("./github.js");
var gmail = require("./quickstart.js");

/*
// Which person is assigned to most to issues?
function findMostFrequentAssignee(user,repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{
			var names = _.pluck(issues,"assignee")
			var frequency = _.countBy(names, function (name) { return name; });
			var max = _.max(_.keys(frequency), function(item){ return frequency[item] })
			resolve({userName: max, count: frequency[max]});
		});
	});
}
 */

function countMails()
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		gmail.ListMessages(auth).then(function (mails) 
		{
			//var states = _.pluck(mails,"state");
			var snip = _.pluck(mails,"snippet");
			var present= _.contains(snip, "merge this pull request online");
			//console.log(states);
			resolve(present);
		});
	});
}

// How many closed issues?
function countClosed(user,repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{
			var states = _.pluck(issues,"state")
			states=_.where(issues, {"state":"closed"});
			//console.log(states);
			resolve(states.length);
		});
	});
}
/*
// How many words in an issue's title version an issue's body?
function titleBodyWordCountRatio(user,repo,number)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getAnIssue(user,repo,number).then(function (issue) 
		{
			var titleWords = issue.title.split(/\W+|\d+/).length;
			var bodyWords  = issue.body.split(/\W+|\d+/).length;
			if( issue.body === "" )
			{
				resolve("NA");
				// HINT: http://stackoverflow.com/questions/4964484/why-does-split-on-an-empty-string-return-a-non-empty-array
			}
			//console.log( titleWords, bodyWords, issue.body);			
			var str = ( titleWords / bodyWords ) + "";
			resolve(str);
		});
	});
}
*/
exports.findMostFrequentAssignee = findMostFrequentAssignee;
exports.countClosed = countClosed;
exports.countMails= countMails;
//exports.titleBodyWordCountRatio = titleBodyWordCountRatio;
