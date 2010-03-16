(color, focus) ->
  min: 20
  max: 300
  for i in [0..rand(6)]
    @circle(focus.x - max*0.5 + rand(max),
            focus.y - max*0.5 + rand(max), min + rand(max - min)).attr({
              stroke: color
            })