Package.describe({
  summary: "Built in user stats at /users-stats route using iron-router."
});

Package.on_use(function (api, where) {
  api.add_files(['lib/subscribe.js', 'router.js', 'injection.js', 'client/views/userStats.html', 'client/userStats.js', 'client/stylesheets/stats.css', 'client/stylesheets/s2.min.css'], ['client']);
  api.add_files(['collections/collections.js'], ['client', 'server'])
  api.add_files(['server/methods.js', 'server/publish.js'], 'server');
  api.use([
    'coffeescript',
    'less',
    'jquery',
    'underscore',
    'iron-router',
    'handlebars',
    'templating'
  ], 'client');

  api.use(['iron-router', 'easy-d3'], 'client');
});

Package.on_test(function (api) {

});