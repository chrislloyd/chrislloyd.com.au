(color) ->
  size: 4 + rand(6)
  step: size + rand(size)
  opacity: Math.random()

  for y in [0..@height] by  step
    @path("M".concat(@width*0.5, ",", y, "L", 0, ',', y+size*0.5, "L", @width*0.5, ',', y+size, 'L', @width, ',', y+size*0.5, 'Z')).attr({
      fill: color
      stroke: 'none'
      opacity: opacity
    })
