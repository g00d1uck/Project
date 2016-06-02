    $.fn.lazy=function(){               // 定义插件 lazy
      var clock;                               
      if(clock)clearTimeout(clock);
      var $node=this;
      clock=setTimeout(function(){
        if($node.attr('loaded')){
          return;
        }
        var nodeTop=$node.offset().top,
        scroll=$(window).scrollTop(),
        winH=$(window).height();
        if((scroll+winH)>nodeTop){
          $node.attr('src',$node.attr('data-src'));
          $node.attr('loaded',true);
        }
      },400)
    };
    // 使用范例如下 先进行一次checkShow进行加载 之后滚动时判断
    // function checkShow(){             
    //   $('img').each(function(){
    //     $(this).lazy();
    //   })
    // };
    // checkShow();                          //  先加载一次
    // $(window).on('scroll',checkShow);     //  滚动条滚动再加载