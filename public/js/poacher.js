$(function(){
  var link = $('a.past'),
      past = $('#past');
  link.click(function(){return false;});
  link.mouseenter(function(){
    past.show();
    link.addClass('active');
  });
  past.mouseleave(function(){
    setTimeout(function(){
      past.hide();
      link.removeClass('active');
    }, 800);
  });
});