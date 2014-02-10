/*****************************
** Collection user-stats
**
** path: Path of the content
** params: params (optional)
** aid: Anonymous user id.
** uid: User Id
** date: Visit date
** 
*/

Stats = new Meteor.Collection('user-stats');

Stats.allow({
  remove: function(){
  	return false;
  }

  , insert: function(){
  	return false;
  }

  , update: function(){
    return false;
  }
});