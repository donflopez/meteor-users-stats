Meteor.publish('Stats', function () {
  return Stats.find({});
});