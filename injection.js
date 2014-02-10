UserStats = {
  addVisit: function(path, params){
    if(!Meteor.user()){
      if(!SessionAmplify.get('anonymous')){
        var anony = new Meteor.Collection.ObjectID();
        SessionAmplify.set('anonymous', anony);
      }
      else
        var anony = SessionAmplify.get('anonymous');
      Meteor.call('saveVisit', path, params, anony);
    }
    else
      Meteor.call('saveVisit', path, params, Meteor.user()._id);
  }
};

callbacks = {
  after: function() {
    UserStats.addVisit(this.path, this.params);
    return this;
  },
  unload: function() {
    return this;
  }
};

RouterMapOld = Router.map;

Router.map = function(map) {
  var cb, result, route, type, _i, _len, _ref;
  result = RouterMapOld.call(this, map);
  _ref = this.routes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    route = _ref[_i];
    if (route.options.disableProgress) {
      continue;
    }
    for (type in callbacks) {
      cb = callbacks[type];
      if (_.isArray(route.options[type])) {
        route.options[type].push(cb);
      } else if (_.isFunction(route.options[type])) {
        route.options[type] = [route.options[type], cb];
      } else {
        route.options[type] = cb;
      }
    }
  }
  return result;
};