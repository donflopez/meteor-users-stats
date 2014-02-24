Router.map(function(){
  this.route('userStats', {
    path:'/user-stats',
    waitOn: function(){
      return Meteor.subscribe('Stats');
    }
  });
});
