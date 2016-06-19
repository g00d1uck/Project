
    function MusicPlug(){
      this.showInterface=true;  // 主页面的显示状态
      this.lyric=true;           // 歌词是否显示
      this.playing=false;        // 是否在播放状态
      this.looping=false;        // 是否单曲循环
      this.volume=1.0;           // 目前的音量
      this.draging=false;        // 是否可拖动
      this.doubanOn=true;       // 是否播放豆瓣的歌曲 
      this.getingDouBan=false;   // 是否正在获取豆瓣歌曲信息 ajax锁
      this.firstPlay=true;     // 是否首次播放，用来判断是否页面多开
      this.linkCss();          // 引入CSS
      this.appendRadioHtml();       // 创建Html
      this.bind();               // 按钮点击事件的绑定
      this.getDouBanSong();       // 获取豆瓣歌曲   
      this.getChannel();       // 获取豆瓣电台信息
      this.drag($('#music-tip'));   // 传递拖动主节点
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
                              +'<span class="douban select">豆瓣电台</span><span class="wangyiyun">网易云搜索</span>'
                            +'</div>'
                            +'<ul class="channel">'
                              +'<li class="icon-ok-circled">随机歌曲 MHz</li>'
                            +'</ul>'
                            +'<ul class="search">'
                              +'<li> 网易云音乐搜索功能 正在完善中</li>'
                            +'</ul>'
                          +'</div>'
                          +'<div id="interface">'
                            +'<div class="stripe"></div>'
                            +'<div class="song-cover"></div>'
                            +'<div class="interface-wrap">'
                              +'<div class="head clear-float">'
                                +'<span class="icon-th-list"></span>'
                                +'<span class="icon-attention-alt"></span>'
                                +'<div class="radio-info">'
                                  +'<h3>Web Radio</h3>'
                                  +'<p>当前版本：V3.0</p>'
                                  +'<p>重构整理Bug</p>'
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

      bind: function(){ 

        var _this=this; 

        $('#music-tip .icon-music').on('click',function(){             //点击乐符 隐藏/显示界面
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
          $('#music-tip .search').hide();
          if(this.innerText===$('#music-tip .douban').text()){
            $('#music-tip .channel').show();
          };
          if(this.innerText===$('#music-tip .wangyiyun').text()){
            $('#music-tip .search').show();
          };
        });

        $('#music-tip .channel').on('click','li',function(){           // 点击 选择电台频道 
          $('#music-tip .channel li').removeClass('icon-ok-circled'); 
          $(this).addClass('icon-ok-circled');            
          _this.getDouBanSong($(this).attr('channel_id'));  
          $('#music-tip .ct').animate({left:'-231px'}, 500);     
          _this.doubanOn=true;
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
            _this.timeArr[i]=_this.timeArr[i]+1;
          }
        });

        $('#music-tip .icon-plus').on('click',function(){
          for(i in _this.timeArr){
            _this.timeArr[i]=_this.timeArr[i]-1;
          }
        });

      },

      startPlay: function(){                       // 开始播放
        if(localStorage.getItem('radioPlaying')==='true')return;
        localStorage.setItem('radioPlaying','true');
        $('#music-tip #frame').contents().find('#player')[0].play();
        $('#music-tip .play').removeClass('icon-play-circled2');
        $('#music-tip .play').addClass('icon-pause-circled');
        this.setTime();
        this.playing=true;
      },

      judgeNex: function(){                      // 判断是否 播放下一首
        if($('#music-tip #frame').contents().find('#player')[0].currentTime >= $('#frame').contents().find('#player')[0].duration){
          if(this.looping)return;
          if(this.doubanOn){
            this.getDouBanSong(this.channel_id);
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
       // 网易云音乐搜索功能 正在完善中
      // songSearch: function(keyIn){             //  搜索歌曲 此处使用网易搜索API 
      //   var _this=this;                      
      //   $.ajax({
      //     url: 'http://s.music.163.com/search/get/',
      //     type: 'GET',
      //     dataType: 'jsonp',
      //     jsonp: 'callback',
      //     data: {
      //       'type': 1,
      //       's': keyIn,
      //       'limit': 50
      //     }
      //   })
      //   .done(function(ret){
      //     _this.songData=ret.result.songs;
      //     if(_this.firstPlay){
      //       if(localStorage.getItem('radioPlaying')==='true')return;
      //     };
      //     _this.firstPlay=false;
      //     _this.changeSong(0);
      //   })
      //   .fail(function() {
      //     console.log("get song fail");
      //   });
      // },

      // changeSong: function(number){                   //  更换歌曲 下一首或新频道 for 网易云
      //   localStorage.setItem('radioPlaying','false');
      //   $('#music-tip #frame').contents().find('#player').attr('src', this.songData[number].audio);
      //   $('#music-tip .song-name').text(this.songData[number].name);
      //   $('#music-tip .song-artist').text(this.songData[number].name+' by '+this.songData[number].artists[0].name);
      //   $('#music-tip .song-cover').css('background-image', 'url('+this.songData[number].album.picUrl+')');
      //   this.startPlay();
      //   $('#music-tip .lyric-list').text('');
      //   $('#music-tip .lyric-list').append('<li>本歌曲暂时无歌词</li><li>请选择豆瓣随机歌曲或点击下一曲</li>');
      // },

      getChannel: function(){             //  获取豆瓣电台频道
        var _this=this;
        $.get('http://api.jirengu.com/fm/getChannels.php', function(ret){
          var ret=JSON.parse(ret);
          _this.appendChannel(ret.channels);
        });
      },

      appendChannel: function(data){      // 将频道信息append到side侧边栏
        var html=''; 
        for(var i=0;i<data.length;i++){
          html += '<li'+' channel_id='+data[i].channel_id+'>'+data[i].name+' MHz'+'</li>';
        };
        $('#music-tip #side .channel').append(html);
      },

      getDouBanSong: function(channel_id){        //  获取豆瓣歌曲

        var _this=this;
        this.channel_id=channel_id;

        if(this.getingDouBan)return;
        this.getingDouBan=true;
        localStorage.setItem('radioPlaying','false');

        $.get('http://api.jirengu.com/fm/getSong.php',{channel: channel_id}, function(ret){
          var ret=JSON.parse(ret);
          $('#music-tip #frame').contents().find('#player').attr('src', ret.song[0].url);
          $('#music-tip .song-name').text(ret.song[0].title);
          $('#music-tip .song-artist').text(ret.song[0].albumtitle+' by '+ret.song[0].artist);
          $('#music-tip .song-cover').css('background-image', 'url('+ret.song[0].picture+')');
          _this.startPlay();
          $('#music-tip .lyric-list').text('');  
          _this.getingDouBan=false;
          _this.getDouBanLyric(ret.song[0].ssid, ret.song[0].sid);
        });
      },

      getDouBanLyric: function(ssid, sid){
        var _this=this;
        $.post('http://api.jirengu.com/fm/getLyric.php', {ssid: ssid, sid: sid }, function(ret){
          var ret=JSON.parse(ret);
          _this.setLyric(ret.lyric);
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
            sec = Number(String(lyricTimeArr[j].match(/\:\d*\.*\d*/g)).slice(1));
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
          this.timeArr.push(i);
        };
        this.timeArr.sort(function(a,b){
          return a-b;
        });
        var lyricHtml='';
        for(var i=0;i<this.timeArr.length;i++){
          lyricHtml += '<li>'+this.lyricData[this.timeArr[i]]+'</li>';
        };
        console.log(lyricHtml);
        $('#music-tip .lyric-list').append(lyricHtml);
        if(!lyricHtml){
          $('#music-tip .lyric-list').append('本歌曲暂时无对应歌词');
        };
        $('#music-tip .lyric-list').css('top', 45);
        this.lyricShowing();
      },

      lyricShowing: function(){           //  根据时间比对 把歌词的容器进行偏移设置 呈现出滚动状态
        var curTime=$('#music-tip #frame').contents().find('#player')[0].currentTime;
        if(!this.timeArr)return;
        for(var i=1;i<this.timeArr.length;i++){
          if((curTime < this.timeArr[i])&&(curTime > this.timeArr[i-1])){
            var liHeight=0;
            for(var j=0;j<=i-1;j++){
              var eachHeight=$('#music-tip .lyric-list li').eq(j).outerHeight(true)-7;
              liHeight += eachHeight;
            };
            $('#music-tip .lyric-list').css('top', 45-liHeight);
            $('#music-tip .lyric-list li').removeClass('showing');
            $('#music-tip .lyric-list li').eq(i-1).addClass('showing');
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
        $('body').on('mousemove',function(e){
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