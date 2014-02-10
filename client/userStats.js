Template.userStats.helpers({
  'totalVisits':function(){
    return Stats.find({}, {fields:{date:1}}).fetch().length;
  },

  'totalSecVisits':function(){
    return Stats.find({cid:Session.get('cid'), sid:Session.get('sid')}).fetch().length;
  },

  'totalUsersVisit':function(){
    return _.filter(Stats.find({}).fetch(), function(data){
      if(data.uid)
        return data;
    }).length;
  },

  'totalAUsersVisit':function(){
    return _.filter(Stats.find({}).fetch(), function(data){
      if(data.aid)
        return data;
    }).length;
  },

  'differentRoutesVisit':function(){
    return _.size(_.countBy(Stats.find({}).fetch(), 'path'));
  },

  'todayVisits':function(){
    var tdy = new Date();
    return Stats.find({date: {$gt:new Date(
      tdy.getFullYear(), tdy.getMonth(), tdy.getDate(), 0, 0, 0, 0
      )}}, {fields:{date:1}}).fetch().length;
  },

  //Unique visitors

  'totalUniqVisitors':function(){
    return _.size(_.countBy(Stats.find({}, {fields:{date:1, aid:1, uid:1}}).fetch(), function(data){
        if(data.uid)
          return data.uid;
        else
          return data.aid;
      }));
  },

  'todayUniqVisitors':function(){
    var tdy = new Date();
    return _.size(_.countBy(Stats.find({date: {$gt:new Date(
      tdy.getFullYear(), tdy.getMonth(), tdy.getDate(), 0, 0, 0, 0
      )}}, {fields:{date:1, aid:1, uid:1}}).fetch(), function(data){
        if(data.uid)
          return data.uid;
        else
          return data.aid;
      }));
  },

  // 
  // GRAPH SECTION
  // 

  'gPerHour':function(){
    return _.map(_.groupBy(Stats.find({}, {fields:{date:1}}).fetch(), function(data){
      return new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), data.date.getHours(), 0, 0, 0).getHours();
    }), function(data, key){
      return {key:key, size:data.length};
    });
  },

  'gPerDay':function(){
    return _.map(_.groupBy(Stats.find({}, {fields:{date:1}}).fetch(), function(data){
      return new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), 0, 0, 0, 0).getDate();
    }), function(data, key){
      return {key:key, size:data.length};
    });
  },

  gtPerHour:function(){
    var dt = new Date();
    var today = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0, 0);
    return _.map(_.groupBy(Stats.find({date: {$gt: today}}, {fields:{date:1}}).fetch(), function(data){
      return new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), data.date.getHours(), 0, 0, 0).getHours();
    }), function(data, key){
      return {key:key, size:data.length};
    });
  },

  gTypesUser:function(){
    return _.map(_.groupBy(Stats.find({}, {fields:{uid:1, aid:1}}).fetch(), function(data){
      if(data.uid)
        return 'User';
      else
        return 'Anonymous';
    }), function(data, key){
      return {key:key, size:data.length};
    });
  },

  gmUniqueVisitors:function(){
    var tdy = new Date();
    return _.map(_.groupBy(Stats.find({date: {$gt:new Date(
      tdy.getFullYear(), tdy.getMonth(), 0, 0, 0, 0, 0
      )}}, {fields:{date:1, aid:1, uid:1}}).fetch(), function(data){
      return new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), 0, 0, 0, 0).getDate();
    }), function(data, key){
      return {key:key, size:_.size(_.countBy(data, function(data){
        if(data.uid)
          return data.uid;
        else
          return data.aid;
      }))}
    });
  }
});

/*Template.userStats.created = function(){
  _.defer(function () {
    var datas = {};
    var svg = {};
    var graph = {};

    Deps.autorun(function () {
      
      datas = _.groupBy(Stats.find({}, {fields:{date:1}}).fetch(), function(data){
        return new Date(data.date.getFullYear(), data.date.getMonth(), data.date.getDate(), data.date.getHours(), 0, 0, 0).getTime();
      });

      if (Deps.currentComputation.firstRun) {
        graph.w = $('#graph').width();
        graph.h = $('#graph').height();

        graph.color = d3.scale.category10();

        svg = d3.select('#graph').append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','0 0 '+Math.min(graph.w,graph.h)+' '+Math.min(graph.w,graph.h))
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform", "translate(" + Math.min(graph.w,graph.h) / 2 + "," + Math.min(graph.w,graph.h) / 2 + ")");

        // A line generator, for the dark stroke.
        graph.line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) {return x(d.date); })
            .y(function(d) {return y(d.price); });

        // A line generator, for the dark stroke.
        var axis = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(graph.h);

        // A area generator, for the dark stroke.
        var area = d3.svg.area()
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y1(function(d) { return y(d.price); });

      }

      datas = _.map(datas, function(data, key){
        return {date:key, price:data.length};
      });
      datas = [datas]; 

      var g = svg.selectAll("g")
            .data(datas)
          .enter().append("g")
            .attr("class", "symbol");
      console.log(datas);
      lines();

      function lines() {
        x = d3.time.scale().range([0, graph.w - 60]);
        y = d3.scale.linear().range([graph.h, 0]);

        // Compute the minimum and maximum date across symbols.
        x.domain([
          d3.min(datas, function(d) { return d[0].date; }),
          d3.max(datas, function(d) { return d[d.length-1].date; })
        ]);

        var g = svg.selectAll(".symbol")
            .attr("transform", function(d, i) { return "translate(0," + (i * graph.h / 4 + 10) + ")"; });
        if(Deps.currentComputation.firstRun){
        g.each(function(d) {
          var e = d3.select(this);

          e.append("path")
              .attr("class", "line");

          e.append("circle")
              .attr("r", 5)
              .style("fill", function(d) { return graph.color(d); })
              .style("stroke", "#000")
              .style("stroke-width", "2px");

          e.append("text")
              .attr("x", 12)
              .attr("dy", ".31em")
              .text('Views');
        });
        }

        function draw(k) {
          g.each(function(d) {
            var e = d3.select(this);
            y.domain([0, 200]);

            e.select("path")
                .attr("d", function(d) {return graph.line(d[k]); });

            e.selectAll("circle, text")
                .data(function(d) { return [d[k],d[k]]; })
                .attr("transform", function(d) {return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
          });
        }

        var k = 0, n = datas[0].length;
        d3.timer(function() {
          draw(k);
          if ((k += 1) >= n - 1) {
            draw(n - 1);
            //setTimeout(horizons, 500);
            return true;
          }
        });
      }

    });

  });

};*/