Meteor.methods({
  'saveVisit' : function(path, params, aid, opt){
    if(this.userId)
      return Stats.insert({path:path, params:params, uid:this.userId, date:new Date(), optional:opt});
    else
      return Stats.insert({path:path, params:params, aid:aid, date:new Date(), optional:opt});
  }
});