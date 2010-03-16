(color, focus) ->
  size: 50+rand(150)
  s: @set()

  for dir in [{x:0,y:1},{x:1,y:0},{x:0,y: -1},{x: -1,y:0}]
    x: focus.x - size*0.5 + size*dir.x
    y: focus.y - size*0.5 + size*dir.y
    s.push @rect(x, y, size, size).attr({fill: color, stroke: 'none'})
  s.rotate(45, focus.x, focus.y)