(color) ->
  for i in [0..(@width+@height)] by 50
    @path(['M', -10, i, 'L', i, -10]).attr({
      stroke: color
      'stroke-width': 10
      fill: 'none'
    })
