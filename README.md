meteor-user-stats
=================

Built in user stats at /users-stats route using iron-router.


### Installation

    mrt add users-stats
    
### Properties

* Multiple stats at /users-stats route using [easy-d3](https://github.com/donflopez/meteor-easy-d3) and [iron-router](https://github.com/EventedMind/iron-router).
* Capture all routes called.
* Use of Amplify for set unique visitors.
* Save own data with each visits.

### How to use

For own data you need to use `SessionAmplify.set('us-condition', {optional:'your condition here'});`

For show without filter by conditions you must put `SessionAmplify.set('us-condition', {});`

For save a own condition use a session variable named `users-stats` like `Session.set('users-stats', 'your condition here');`

### To-Do

* Save own data with each visits. *Done*
* Save browser and ip data.
* Get online time.
* Get online users.

### License

MIT
