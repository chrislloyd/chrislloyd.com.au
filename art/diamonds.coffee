(color, focus) ->
  size: 100
  @circle(focus.x, focus.y, 3).attr({fill: 'FF000', stroke: 'none'})

  @rect(focus.x - size*0.5, focus.y - size*0.5, size, size)