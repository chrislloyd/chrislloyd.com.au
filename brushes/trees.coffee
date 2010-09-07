Artist.add (color) ->
  width = 300
  height = 300
  x = rand(@width*0.75) - (width*0.5)
  y = rand(@height*0.9) + (width*0.5)
  for i in [0..4]
    @rect(x, y-(i*80), width, height).attr({
      stroke: 'none'
      fill: color
      rotation: 45
      opacity: (100 - (i*20))/100
    })