    $.fn.stick=function(){
      var $nav=this,
      $curW=$nav.width(),        
      $curH=$nav.height(),
      $top=$nav.offset().top,
      $left=$nav.offset().left,
      $cloneNav=$nav.clone().insertBefore($nav).hide();

      $(window).on('scroll',function(){
        var $scrolltop=$(window).scrollTop();
        if($scrolltop>$top){
          fixed();
        }
        if($scrolltop<$top){
          unfixed();
        }
      });

      function fixed(){
        $cloneNav.css({
          position: 'fixed',
          left: $left,
          top: 0,
          width: $curW,
          margin: 0
        }).show();
        $nav.css('visibility','hide');
      }
      function unfixed(){
        $cloneNav.hide();
        $nav.css('visibility','visible');
      }
    }