    $.fn.water=function(){             //定义 瀑布流布局插件
      var $node=this;                   //定义部分
        $child=$node.children();
        width=$child.eq(0).outerWidth(true);
        colNum=Math.floor($node.width()/width);
        arr=[];
        min=0;
      for(var i=0;i<colNum;i++){                 //按算出来的列宽 初始化数组
        arr.push(0);
      }
      $child.each(function(){                   //函数主体 针对每个子元素
        for(var i=0;i<arr.length;i++){          //计算最短的是哪一列
          if(arr[i]<arr[min]){
            min=i;
          }
        }
        $(this).css({                           //按照算出的最小列序号 定位置 
          left: min*width,
          top: arr[min]
        });
        arr[min]+=$(this).outerHeight(true);//完成后 把新的高度赋给最短的那一列
      });
    };
    // 使用范例如下
    // $('.ct').render(); // 对.ct节点进行瀑布流布局
    // $(window).on('resize',function(){ // 这里做了个响应式 当窗口变化时 重新进行布局
    //   $('.ct').render();     
    // })