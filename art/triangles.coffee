(color) ->
  r: 40
  c: {x: rand(@width), y: rand(@height)}

  distance: (x1,y1,x2,y2) ->
    Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1, 2))

  for x in [0..@width] by 80
    for y in [0..@height] by 80
      @path("M".concat(x, ",", y, "m0-", r * 0.58, "l", r * 0.5, ",", r * 0.87, "-", r, ",0z")).attr({
        fill: color
        stroke: 'none'
        opacity: ((@width/2) - distance(x, y, c.x, c.y)) / (@width/2)
      })
