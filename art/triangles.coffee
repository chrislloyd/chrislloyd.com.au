(color) ->
  size: 20 + rand(20)
  spacing: 60 + rand(20)
  c: {x: rand(@width), y: rand(@height)}

  distance: (x1,y1,x2,y2) ->
    Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1, 2))

  for x in [0..@width] by spacing
    for y in [0..@height] by spacing
      @path("M".concat(x, ",", y, "m0-", size * 0.58, "l", size * 0.5, ",", size * 0.87, "-", size, ",0z")).attr({
        fill: color
        stroke: 'none'
        opacity: ((@width/2) - distance(x, y, c.x, c.y)) / (@width/2)
      })
