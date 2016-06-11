
    function MusicPlug(){
      this.showInterface=false;  // 主页面的显示状态
      this.lyric=true;           // 歌词是否显示
      this.playing=false;        // 是否在播放状态
      this.looping=false;        // 是否单曲循环
      this.curChannel_id=0;      // 网易云默认的频道ID
      this.curSong_id=0;         // 网易云的歌曲ID
      this.volume=1.0;           // 目前的音量
      this.draging=false;        // 是否可拖动
      this.doubanOn=false;       // 是否播放豆瓣的歌曲 
      this.getingDouBan=false;   // 是否正在获取豆瓣歌曲信息 ajax锁
      this.firstPlay=true;
      this.channel_data=["华语","欧美","七零","八零","九零","粤语","摇滚","民谣","轻音乐","原声","爵士","电子","说唱","R&B ","日语歌曲","韩语歌曲","女声","法语","古典","动漫","咖啡馆","圣诞","世界音乐","布鲁斯","新歌","雷鬼","世界杯","小清新","Easy ","91.1 ","Pop","拉丁",];
      this.linkCss();
      this.appendRadioHtml();
      this.appendChannel(this.channel_data);  // 默认网易云 无需获取频道ID
      this.bind();                            // 按钮点击事件的绑定
      this.defaultSet();                      // 默认选择网易云第一个频道 第一首歌
      this.songSearch(this.channel_data[this.curChannel_id]);  // 默认网易云 去获取歌曲 
      this.drag($('#music-tip'));          // 传递拖动主节点
      this.setTime();                      // 定时函数  更新进度条及歌词滚动
    };

    MusicPlug.prototype={

      linkCss: function(){
        var linkcss='<link rel="stylesheet" href="css/fontello.css"><link rel="stylesheet" href="css/radio.css">'
        $('head').append(linkcss);
      },

      appendRadioHtml: function(){
        var radioHtml='';
        radioHtml +='<div id="music-tip">'
                      +'<span class="icon-music"></span>'
                      +'<div class="screen">'
                        +'<div class="ct clear-float">'
                          +'<div id="side">'
                            +'<div class="nav">'
                              +'<span class="span-left select">网易云</span><span class="douban">豆瓣随机</span><span class="span-right">搜索</span>'
                            +'</div>'
                            +'<ul class="channel"></ul>'
                            +'<ul class="song-random">'
                              +'<li>豆瓣随机音乐</li>'
                              +'<li>大部分是轻音乐</li>'
                            +'</ul>'
                            +'<ul class="search"></ul>'
                          +'</div>  '
                          +'<div id="interface">'
                            +'<div class="stripe"></div>'
                            +'<div class="song-cover"></div>'
                            +'<div class="interface-wrap">'
                              +'<div class="head clear-float">'
                                +'<span class="icon-th-list"></span>'
                                +'<span class="icon-attention-alt"></span>'
                                +'<div class="radio-info">'
                                  +'<h3>Web Radio</h3>'
                                  +'<p>当前版本：V2.0</p>'
                                  +'<p>增加豆瓣随机</p>'
                                  +'<p>By 柯良勇</p>'
                                +'</div>'
                              +'</div>'
                              +'<div class="main">'
                                +'<h1 class="song-name">歌名</h1>'
                                +'<span class="icon-rewind-outline"></span>'
                                +'<div class="play icon-play-circled2"><iframe id="frame" src="referpolicy.html" frameborder="0"></iframe></div>'
                                +'<span class="icon-fast-fw-outline"></span>'
                                +'<div class="lyric-place">'
                                  +'<ul class="lyric-list"></ul>'
                                +'</div>'
                                +'<div class="main-icon">'
                                  +'<span class="icon-plus"></span>'
                                  +'<span class="icon-minus"></span>'
                                  +'<span class="icon-loop-alt"></span>'
                                  +'<span class="icon-user"></span>'
                                  +'<span class="icon-volume-high volume"></span>'
                                  +'<span class="volume-adj">'
                                    +'<span class="triangle"></span>'
                                    +'<span class="volume-light"></span>'
                                    +'<span class="volume-outline"></span>'
                                  +'</span>'
                                  +'<span class="icon-download"></span>'
                                  +'<span class="icon-lock-open"></span>'
                                +'</div>'
                                +'<div class="time-outline">'
                                  +'<div class="time"></div>'
                                +'</div>'
                                +'<span class="cur-time">2:02</span>'
                                +'<span class="total-time">3:03</span>'
                              +'</div>'
                              +'<div class="footer clear-float">'
                                +'<span class="icon-toggle-on switch"></span>'
                                +'<p class="song-artist">歌名及演唱者</p>'
                              +'</div>'
                            +'</div>'
                          +'</div>'
                        +'</div>'  
                      +'</div>'
                    +'</div>';
        $('body').append(radioHtml);
      },

      defaultSet: function(){
        $('#music-tip .channel li').eq(0).addClass('icon-ok-circled');  // 默认选择第一个频道
      },

      bind: function(){ 

        var _this=this; 

        $('#music-tip .icon-music').on('click',function(){ //点击乐符 隐藏/显示界面
          if(_this.showInterface){
            $('#music-tip .screen').hide('400');
            _this.showInterface=false;
          }else{
            $('#music-tip .screen').show('400');
            _this.showInterface=true;
          };
        });

        $('#music-tip .icon-attention-alt').on('mouseover',function(){  // 移入!号 显示软件信息
          $('#music-tip .radio-info').fadeIn();
        });

        $('#music-tip .icon-attention-alt').on('mouseleave',function(){ // 移出!号 隐藏软件信息
          $('#music-tip .radio-info').fadeOut();
        });
        
        $('#music-tip .icon-th-list').on('mouseover',function(){  //   移入  显示侧边栏
          $('#music-tip .ct').animate({left:'0'}, 400);
        });

        $('#music-tip #side').on('mouseleave',function(){        //   移出   隐藏侧边栏
          $('#music-tip .ct').animate({left:'-231px'}, 400);
        });

        $('#music-tip .nav').on('click','span',function(){    //  点击 侧边栏 选择网易、豆瓣、搜索 
          $('#music-tip .nav span').removeClass('select');
          $(this).addClass('select');
          $('#music-tip .channel').hide();
          $('#music-tip .song-random').hide();
          $('#music-tip .search').hide();
          if(this.innerText===$('#music-tip .span-left').text()){
            $('#music-tip .channel').show();
          };
          if(this.innerText===$('#music-tip .douban').text()){
            $('#music-tip .song-random').show();
            if(!_this.doubanOn)_this.getDouBanSong();
            $('#music-tip .ct').animate({left:'-231px'}, 500);          // 侧边栏归位
            _this.sideStatus=false;
            $('#music-tip .channel li').removeClass('icon-ok-circled'); 
            _this.doubanOn=true;
          };
          if(this.innerText===$('#music-tip .span-right').text()){
            $('#music-tip .search').show();
          };
        });

        $('#music-tip .channel').on('click','li',function(){           // 点击 选择电台频道 
          $('#music-tip .channel li').removeClass('icon-ok-circled'); 
          $(this).addClass('icon-ok-circled');             // 增加打勾标记
          _this.curChannel_id=$(this).attr('channel_id');   // 传递选中的频道ID
          _this.songSearch(_this.channel_data[_this.curChannel_id]);
          $('#music-tip .ct').animate({left:'-231px'}, 500);          // 侧边栏归位
          _this.sideStatus=false;
          _this.doubanOn=false;
        });

        $('#music-tip .switch').on('click',function(){              // 点击 开/关歌词
          if(_this.lyric){
            $(this).removeClass('icon-toggle-on');
            $(this).addClass('icon-toggle-off');
            $('#music-tip .lyric-list').hide();
            _this.lyric=false;
          }else{
            $(this).removeClass('icon-toggle-off');
            $(this).addClass('icon-toggle-on');
            $('#music-tip .lyric-list').show();
            _this.lyric=true;
          };
        });

        $('#music-tip .play').on('click',function(){           // 点击  播放/暂停
          if(_this.playing){
            _this.stopPlay();
          }else{
            _this.startPlay();
          };
        });

        $('#music-tip .icon-rewind-outline').on('click',function(){  //  点击  上一首 
          if(_this.doubanOn){
            _this.getDouBanSong();
          }else{
            if(_this.curSong_id===0)_this.curSong_id=1;
            _this.curSong_id--;
            _this.changeSong(_this.curSong_id);
          };
        });

        $('#music-tip .icon-fast-fw-outline').on('click',function(){  //  点击  下一首 
          if(_this.doubanOn){
            _this.getDouBanSong();
          }else{
            _this.curSong_id++;
            _this.changeSong(_this.curSong_id);
          };
        });

        $('#music-tip .triangle').on('click',function(){       // 点击 静音
          if($('#music-tip #frame').contents().find('#player')[0].volume === 0.0){
            $('#music-tip #frame').contents().find('#player')[0].volume=_this.volume;
            _this.volumeOn();
          }else{
            $('#music-tip #frame').contents().find('#player')[0].volume = 0.0;
            _this.volumeOff();
          } 
        });

        $('#music-tip .volume').on('mouseover',function(){  //     鼠标进入 显示音量
          $('#music-tip .volume-adj').show();
        });

        $('#music-tip .volume-adj').on('mouseleave',function(){ //  鼠标移开 隐藏音量
          $('#music-tip .volume-adj').hide();
        });

        $('#music-tip .volume-outline').on('click',function(e){  //  点击 调节音量
          _this.volume=(e.pageX-$(this).offset().left)/100;
          $('#music-tip #frame').contents().find('#player')[0].volume=_this.volume;
          if(_this.volume === 0){
            _this.volumeOff();
          };
          $('#music-tip .volume-light').css('width', _this.volume*100);
          _this.volumeOn();
        });

        $('#music-tip .time-outline').on('click',function(e){  //  点击 调节播放进度
          _this.currentTime=((e.pageX-$(this).offset().left)/200)*$('#music-tip #frame').contents().find('#player')[0].duration;
          $('#music-tip #frame').contents().find('#player')[0].currentTime=_this.currentTime;
          var timeNumber=_this.dealTime(_this.currentTime);
          $('#music-tip .cur-time').text(timeNumber);
          _this.judgeNex();
          $('#music-tip .time').css('width', e.pageX-$(this).offset().left);
        });

        $('#music-tip .icon-loop-alt').on('click',function(){  // 点击 增/减 单曲循环状态
          if(_this.looping){
            $('#music-tip #frame').contents().find('#player').removeAttr('loop');
            $(this).css('color', '#fff');
            _this.looping=false;
          }else{
            $('#music-tip #frame').contents().find('#player').attr('loop','');
            $(this).css('color', '#6c9');
            _this.looping=true;
          } 
        });

        $('#music-tip .icon-lock-open').on('click',function(){   // 点击 移除localstorage的状态
          localStorage.removeItem('radioPlaying');
        });

        $('#music-tip .icon-minus').on('click',function(){
          for(i in _this.timeArr){
            _this.timeArr[i]=_this.timeArr[i]-1;
          }
        });

        $('#music-tip .icon-plus').on('click',function(){
          for(i in _this.timeArr){
            _this.timeArr[i]=_this.timeArr[i]+1;
          }
        });

      },

      startPlay: function(){                       // 开始播放
        if(localStorage.getItem('radioPlaying')==='true')return;
        localStorage.setItem('radioPlaying','true');
        $('#music-tip #frame').contents().find('#player')[0].play();
        $('#music-tip .play').removeClass('icon-play-circled2');
        $('#music-tip .play').addClass('icon-pause-circled');
        this.playing=true;
      },

      judgeNex: function(){                      // 判断是否 播放下一首
        if($('#music-tip #frame').contents().find('#player')[0].currentTime >= $('#frame').contents().find('#player')[0].duration){
          if(this.looping)return;
          if(this.doubanOn){
            this.getDouBanSong();
          }else{
            this.curSong_id++;
            this.changeSong(this.curSong_id);
          };
        };
      },

      stopPlay: function(){                       // 停止播放
        $('#music-tip #frame').contents().find('#player')[0].pause();
        $('#music-tip .play').removeClass('icon-pause-circled');
        $('#music-tip .play').addClass('icon-play-circled2');
        localStorage.setItem('radioPlaying','false');
        this.playing=false;
      },

      volumeOff: function(){                        // 静音的处理函数
        $('#music-tip .volume').removeClass('icon-volume-high');
        $('#music-tip .volume').addClass('icon-volume-off');
      },

      volumeOn: function(){                       //  开启声音的处理函数
        $('#music-tip .volume').removeClass('icon-volume-off');
        $('#music-tip .volume').addClass('icon-volume-high');
      },

      setDuration: function(){      // 获取歌曲总时长 注意此函数由iframe中的audio oncanplay事件触发后调用
        var timeNumber=this.dealTime($('#music-tip #frame').contents().find('#player')[0].duration);
        $('#music-tip .total-time').text(timeNumber);
      },

      setTime: function(){                       // 定时更新播放条 时间
        var _this=this;
        var clock=setInterval(function(){
          var time=$('#music-tip #frame').contents().find('#player')[0].currentTime/$('#music-tip #frame').contents().find('#player')[0].duration;
          var timeNumber=_this.dealTime($('#music-tip #frame').contents().find('#player')[0].currentTime);
          $('#music-tip .cur-time').text(timeNumber);
          if(time>=1){
            $('#music-tip .time').css('width', '0');
          }else $('#music-tip .time').css('width', 200*time);
          _this.judgeNex();
          if(_this.doubanOn)_this.lyricShowing();
        },100);
      },

      dealTime: function(second){            // 传入秒数 处理成 00:00 的格式输出
        var second=parseInt(second);
        var min=Math.floor(second/60);
        var sec=second-min*60;
        if(min<10){
          min=0+String(min);
        }else min=String(min);
        if(sec<10){
          sec=0+String(sec);
        }else sec=String(sec);
        return (min+':'+sec);
      },

      appendChannel: function(channel_data){      // 读取频道信息 并放到side侧边栏
        var html='';
        for(var i=0;i<channel_data.length;i++){
          html += '<li'+' channel_id='+i+'>'+channel_data[i]+' MHz'+'</li>';
        };
        $('#music-tip #side .channel').append($(html));
      },

      songSearch: function(name){             //  获取歌曲数据 此处使用网易搜索API 
        var _this=this;                       //  以电台名进行搜索 模拟电台效果
        $.ajax({
          url: 'http://s.music.163.com/search/get/',
          type: 'GET',
          dataType: 'jsonp',
          jsonp: 'callback',
          data: {
            'type': 1,
            's': name,
            'limit': 50
          }
        })
        .done(function(ret){
          _this.songData=ret.result.songs;
          if(_this.firstPlay){
            if(localStorage.getItem('radioPlaying')==='true')return;
          };
          _this.firstPlay=false;
          _this.changeSong(0);
        })
        .fail(function() {
          console.log("get song fail");
        });
      },

      changeSong: function(number){                   //  更换歌曲 下一首或新频道 for 网易云
        localStorage.setItem('radioPlaying','false');
        $('#music-tip #frame').contents().find('#player').attr('src', this.songData[number].audio);
        $('#music-tip .song-name').text(this.songData[number].name);
        $('#music-tip .song-artist').text(this.songData[number].name+' by '+this.songData[number].artists[0].name);
        $('#music-tip .song-cover').css('background-image', 'url('+this.songData[number].album.picUrl+')');
        this.startPlay();
        $('#music-tip .lyric-list').text('');
        $('#music-tip .lyric-list').append('<li>本歌曲暂时无歌词</li><li>请选择豆瓣随机歌曲或点击下一曲</li>');
      },

      getDouBanSong: function(){                 //  获取豆瓣随机歌曲的信息 for 豆瓣

        var _this=this;

        if(this.getingDouBan)return;
        this.getingDouBan=true;
        localStorage.setItem('radioPlaying','false');

        $.ajax({
          url: 'http://api.jirengu.com/fm/getSong.php',
          type: 'GET',
          dataType: 'json',
        })
        .done(function(ret){
          $('#music-tip #frame').contents().find('#player').css('type', 'video/mp4');
          $('#music-tip #frame').contents().find('#player').attr('src', ret.song[0].url);
          $('#music-tip .song-name').text(ret.song[0].title);
          $('#music-tip .song-artist').text(ret.song[0].albumtitle+' by '+ret.song[0].artist);
          $('#music-tip .song-cover').css('background-image', 'url('+ret.song[0].picture+')');
          _this.startPlay();
          $('#music-tip .lyric-list').text('');  // 不管有无歌词都显示此信息 有歌词后面会覆盖
          $('#music-tip .lyric-list').append('<li>本歌曲暂时无歌词</li>');
          _this.getingDouBan=false;
          $.ajax({
            url: 'http://api.jirengu.com/fm/getLyric.php',
            type: 'post',
            dataType: 'json',
            data:{
              ssid:ret.song[0].ssid,
              sid:ret.song[0].sid,
            }
          })
          .done(function(ret){
            console.log(ret.lyric);
            _this.setLyric(ret.lyric);
          })
          .fail(function() {
            alert("get douban lyric error");
          });

        })
        .fail(function() {
          alert("get douban song error");
        });
      },

      setLyric: function(lyric){              //  处理歌词 获取时间及歌词文本
        var lyricData={};
        var lyricArr=lyric.split('\n');
        var reg=/\[\d*:\d*((\.|\:)\d*)*\]/g;
        for(i in lyricArr){
          var lyricTimeArr=lyricArr[i].match(reg);
          if(!lyricTimeArr)continue;
          var lyricText=lyricArr[i].replace(reg,'');
          lyricText=lyricText.replace(/\[offset:.+\]/g,'');
          for(j in lyricTimeArr){
            var min = Number(String(lyricTimeArr[j].match(/\[\d*/i)).slice(1)),
            sec = Number(String(lyricTimeArr[j].match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lyricData[time]=lyricText;
          };
        };
        this.appendLyric(lyricData);
      },

      appendLyric: function(lyricData){           //  把处理后的歌词 添加到页面上
        this.timeArr=[];
        this.lyricData=lyricData;
        for(i in lyricData){
          this.timeArr.push(parseInt(i));
        };
        this.timeArr.sort(function(a,b){
          return a-b;
        });
        var lyricHtml='<li></li><li></li>';
        for(var i=0;i<this.timeArr.length;i++){
          lyricHtml += '<li>'+this.lyricData[this.timeArr[i]]+'</li>';
        };
        $('#music-tip .lyric-list').text('');
        $('#music-tip .lyric-list').append(lyricHtml);
        this.lyricShowing();
      },

      lyricShowing: function(){           //  根据时间比对 把歌词的容器进行偏移设置 呈现出滚动状态
        var curTime=$('#music-tip #frame').contents().find('#player')[0].currentTime;
        if(!this.timeArr)return;
        for(var i=0;i<this.timeArr.length;i++){
          if(this.timeArr[i]===Math.floor(curTime)){
            $('#music-tip .lyric-list li').removeClass('showing');
            $('#music-tip .lyric-list li').eq(i+2).addClass('showing');
            var liHeight=0;
            for(var j=0;j<=i;j++){
              liHeight = liHeight+$('#music-tip .lyric-list li').eq(j).outerHeight(true)-7;
            };
            $('#music-tip .lyric-list').animate({'top':-liHeight},'400');
          };
        };
      },

      drag: function($node){                        //  给定节点 实现拖拽
        var _this=this;
        $node.on('mousedown',function(e){
          $node.addClass('drag-sign');
          _this.left=e.pageX-$node.offset().left;
          _this.top=e.pageY-$node.offset().top;
          _this.draging=true;
        });
        $node.on('mouseup',function(){
          _this.draging=false;
          $node.removeClass('drag-sign');
        });
        $(window).on('mousemove',function(e){
          if(_this.draging){
            $node.css({
              left: +e.pageX-_this.left,
              top: e.pageY-_this.top
            });
          };
        });
      },

    };
    var musicPlug=new MusicPlug();