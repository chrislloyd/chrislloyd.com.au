Artist.add (color) ->
  step: 20 + rand(30)
  weight: 1 + rand(10)
  for i in [0..(@width+@height)] by step
    @path(['M', -weight, i, 'L', i, -weight]).attr({
      stroke: color
      'stroke-width': weight
      fill: 'none'
    })
