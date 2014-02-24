Router.map(function(){
  this.route('userStats', {
    path:'/user-stats',
    waitOn: function(){
      Meteor.subscribe('Stats');
    }
  });
});
