$(function(){
  var contents = $('#contents');
  contents.hover(function(){
    contents.addClass('active');
    $('ol', contents).show();
  }, function(){
    setTimeout(function(){
      contents.removeClass('active');
      $('ol', contents).hide();
    },300)
  });

  // Disables contents link
  $('a:first', contents).click(function(){
    $('ol', contents).show();
    return false;
  });
});
