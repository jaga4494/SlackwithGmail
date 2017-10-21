var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");

var main = require("../main.js");

// Load mock data
var data = require("../mock.json")
var data = require("../mock1.json")
///////////////////////////
// TEST SUITE FOR MOCHA
///////////////////////////

describe('testMain', function(){

  // MOCK SERVICE
   var mockService = nock("https://www.googleapis.com")
   .persist() // This will persist mock interception for lifetime of program.
   .get("gmail/v1/users/jaga4494/messages")
   .reply(200, JSON.stringify(data) );


   describe('#mailCount()', function() {
    
        it('should find 2 pull request emails', function() {
          return main.countMails("jaga4494", "Hello-World").then(function (results) 
          {
            expect(results).to.equal(2);
          });
        }); 
    
      }); 
      describe('#closedCount()', function() {
        
            it('should find 4 closed issues', function() {
              return main.countClosed("testuser", "Hello-World").then(function (results) 
              {
                expect(results).to.equal(4);
              });
            }); 
        
          });

   /*
  describe('#findMostFrequentAssignee()', function(){
    // TEST CASE
   	it('should return valid object properties', function(done) {

      main.findMostFrequentAssignee("testuser", "Hello-World").then(function (results) 
      {
        expect(results).to.have.property("userName");
        expect(results).to.have.property("count");

        var userName = results.userName;
        var count    = results.count;

        // Call back to let mocha know that test case is done. Need this for asychronous operations.
        done();
      });
    });

    // TEST CASE...
    it('should find octocat with 4 issues assigned', function() {
      // it is also possible to just return a promise, without using done.
      return main.findMostFrequentAssignee("testuser", "Hello-World").then(function (results) 
      {
        expect(results.userName).to.equal("octocat");
        expect(results.count).to.equal(4);
      });
    });
  }); */


/*
  describe('#titleBodyWordCountRatio()', function() {

    var issue0 = nock("https://api.github.com")
      .get("/repos/testuser/Hello-World/issues/0")
      .reply(200, JSON.stringify(data.issueList[0]) );

    it('ration should be .5 for issue #0', function() {
      return main.titleBodyWordCountRatio("testuser", "Hello-World",0).then(function (results) 
      {
        expect(results).to.equal("0.5");
      });
    }); 

    it('should handle empty body for issue #2', function() {
      return main.titleBodyWordCountRatio("testuser", "Hello-World",2).then(function (results) 
      {
        expect(results).to.equal("NA");
      });
    }); 


  });  */
});
