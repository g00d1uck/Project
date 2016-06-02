var util={ 

	/* class操作的封装 */
	hasClass: function(el, cls){
		var regex=new RegExp('\\b'+cls+'\\b','g');
		return regex.test(el.className);
	},
	addClass: function(el, cls){
		if(hasClass(el,cls)===false){
			el.className += " "+cls;
		}
	},
	removeClass: function(el,cls){
		if(hasClass(el,cls)===true){
			var regex=new RegExp('\\b'+cls+'\\b','g');
			el.className=el.className.replace(regex,"");
			el.className=el.className.replace(/\s{2}/g," ");
		}
	},

	/* 获取随机数 */
	getRandom: function(min,max){
		return (Math.floor((max-min+1)*Math.random()+min));  
	},

	/* 时间日期操作 */
	countDown: function(char){      
 		var intv=(Date.parse(char)-Date.now());  // 倒计时 countDown("2016-09-01")
 		var a=1000*60*60*24;
 		var day=Math.floor(intv/a);
 		var hours=Math.floor((intv-day*a)/a*24);
 		var minute=Math.floor((intv-day*a-hours*a/24)/a*24*60);
 		var second=Math.floor((intv-day*a-hours*a/24-minute*a/24/60)/a*24*60*60);
 		return '倒计时'+day+'天'+hours+'小时'+minute+'分'+second+'秒';
 	}, 
 	getChsDate: function(char){ 
 		var char=(char.split('-')); // 将日期转换为中文 var str = getChsDate('2015-10-10')    
 		var newarr=[];
 		chs=['零','一','二','三','四','五','六','七','八','九','十'];
 		for(var i in char){
 			newarr.push(char[i].split(''));
 		}
 		year=chs[newarr[0][0]]+chs[newarr[0][1]]+chs[newarr[0][2]]+chs[newarr[0][3]]+'年';
 		if ([newarr[1][0]===1]){
 			month='十'+chs[newarr[1][1]]+'月';
 		}else {
 			month=chs[newarr[1][1]]+'月';
 		}
 		switch (newarr[2][0]){
 			case "0":
 			day=chs[newarr[2][1]]+'日';break;
 			case "1":
 			day='十'+chs[newarr[2][1]]+'日';break;
 			case "2":
 			day='二十'+chs[newarr[2][1]]+'日';break;
 			default:
 			day='三十'+chs[newarr[2][1]]+'日';
 		}
 		month=month.replace('零','');
 		day=day.replace('零','');
 		return year+month+day;
 	},

 	/* 对象深拷贝 */
 	objCopy: function (obj){
 		var newobj=obj;
 		for(i in obj){
 			if(typeof obj[i]!=='object')
 				newobj[i]=obj[i];
 			else{
 				newobj[i]=arrayCopy(obj[i]);
 			}
 		}
 		return newobj;
 	},

 	/* 正则表达式 判断用户名、密码等 */
 	isEmail: function(str){
 		return (/^[a-zA-Z0-9]\w+@\w+\.\w+/.test(str));
 	},
 	isPhoneNum: function(str){
 		return (/^1[3-8]\d{9}$/.test(str));
 	},
 	isValidUsername: function(str){ //长度6-20个字符，只能包括字母、数字、下划线
 		return (/^\w{6,20}$/.test(str));
 	},
 	isValidPassword: function(str){ //长度6-20个字符，包括大写字母、小写字母、数字、下划线至少两种
 		var i=0;
 		if(/^\w{6,20}$/.test(str)){
 			if(/[a-z]/.test(str)){
 				i++;
 			};
 			if(/[A-Z]/.test(str)){
 				i++
 			};
 			if(/[0-9]/.test(str)){
 				i++
 			};
 			if(/_/.test(str)){
 				i++
 			};
 			if(i>1){
 				return true;
 			}else return false;;
 		}else return false;
 	},

 	/* 事件绑定的封装 */
  index: function(e,node){  // children No. 判断子元素序列
  	for(var i=0;i<node.children.length;i++){
  		if(e.target===node.children[i]){
  			return i+1;
  		}
  	};
  },
  bind: function(elem,type,handler){
  	if(elem.addEventListener){
  		elem.addEventListener(type,handler,false);
  	}else if(elem.attachEvent){
  		elem.attachEvent("on"+type,handler);
  	}else{
  		elem["on"+type]=handler;
  	}
  },
  unbind: function(elem,type,handler){
  	if(elem.removeEventListener){
  		elem.removeEventListener(type,handler,false);
  	}else if(elem.detachEvent){
  		elem.detachEvent("on"+type,handler);
  	}else{
  		elem["on"+type]=null;
  	}
  },
  getEvent: function(event){
  	return event?event:window.event;
  },
  getTarget: function(event){
  	return event.target||event.srcElement;
  },
  preventDefault: function(event){
  	if(event,preventDefault){
  		event.preventDefault();
  	}else{
  		event.returnValue = false;
  	}
  },
  stopPropagation: function(event){
  	if(event.stopPropagation){
  		event.stopPropagation();
  	}else{
  		event.cancelBubble=true;
  	}
  },

  /* 原生js封装ajax  类似jquery */
  ajax: function(opts){
  	var request = new  XMLHttpRequest();
  	var str = '';
  	for(i in opts.data){
  		str += i+'='+opts.data[i]+'&';
  	}
  	str = str.substr(0, str.length-1); 
  	if(opts.type.toLowerCase() === 'get'){
  		request.open('GET', opts.url+'?'+str, true);
  		request.send();
  	}
  	if(opt.type.toLowerCase() === 'post'){
  		resuest.open('POST', opt.url, true);
  		ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  		request.send(str);
  	}
  	request.onreadystatechange=function(){
  		if(request.readyState==4 && request.status==200){
  			var responsetext=JSON.parse(request.responseText);
  			opts.success(responsetext);
  		}
  		if(request.status!==200){
  			opts.error();
  		}
  	}
  },
 	// 调用方法如下例子所示：
 	// document.querySelector('#btn').addEventListener('click', function(){
 	// 	ajax({
  //   url: 'getData.php',   //接口地址
  //   type: 'get',               // 类型， post 或者 get,
  //   data: {
  //   	username: 'xiaoming',
  //   	password: 'abcd1234'
  //   },
  //   success: function(ret){
  //       console.log(ret);       // {status: 0}
  //     },
  //     error: function(){
  //     	console.log('出错了')
  //     }
  //   })
 	// });
 };