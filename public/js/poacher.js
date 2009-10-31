$(function(){
  var contents = $('.contents')
      contentsBody = $('ol',contents),
      colophonLink = $('.colophon a');

  function hideContents() {
    contents.removeClass('active');
    contentsBody.hide();
  }

  contents.hover(function(){
    contents.addClass('active');
    contentsBody.show();
  }, function(){
    setTimeout(hideContents,300);
  });

  // Disables contents link
  $('a:first', contents).click(function(){
    contents.mouseover();
    return false;
  });

  colophonLink.mouseenter(hideContents);

});
