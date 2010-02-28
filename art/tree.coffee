(color) ->
  width: 300
  height: 300
  x: rand(@width /2) + (@width/4) - (width/2)
  y: rand(@height/2) + (@height/4) - (width/2)
  for i in [0..4]
    @rect(x, y-(i*80), width, height).attr({
      stroke: 'none'
      fill: color
      rotation: 45
      opacity: (100 - (i*20))/100
    })