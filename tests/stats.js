//tests/posts.js
var assert = require('assert');

suite('Stats', function() {
  test('Generating stats.', function(done, server, client) {
    server.eval(function() {
      for (var i = 0; i < 200; i++) {
        Accounts.createUser({
          username: 'joeschmoe'+i,
          password: 'password'+i,
          email: 'joe'+i+'@schmoe.com',
          profile: {
            name: 'Joe Schmoe '+i
          }
        });
      };
      assert.equal(Meteor.users.find({}).fetch().length, 500);
      //emit('finished', Stats.find({}).fetch().length);
    });
    
    client.eval(function(){
      for (var i = 500 - 1; i >= 0; i--) {
        Meteor.loginWithPassword('joeschmoe'+i, 'password'+i, function(err){
          if(!err)
            Meteor.call('saveVisit', 1, 2, function (error, result) {
              Meteor.logout();
              done();
            });
        });
      };
      server.eval(function(){
        emit('finished');
      });
    });

    server.once('finished', function(){
      assert.equal(Stats.find({}).fetch().length, 500);
      done();
    });

  });

  test('Logging in users and generating visits', function(done, server, client) {
    done();
  });

});