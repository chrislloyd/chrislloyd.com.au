(color) ->
  radius: 350
  @circle(@width/2, rand(2*radius)+radius, radius).attr({
    fill: color
    stroke: 'none'
    opacity: Math.random()
  })