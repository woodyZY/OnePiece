$(document).ready(function(){
	//判断管理员登录状态，如果登录成功则在导航条显示管理权限：查看和新增
	if($("#isLogin").val()==="true"){
	    $("#loginIn").css("display","none");
	    $("#loginOut").css("display","block");
	}
	else if($("#isLogin").val()==="false"){
	    $("#loginOut").css("display","none");
	    $("#loginIn").css("display","block");
	}
	else{
		$("#loginOut").css("display","none");
	    $("#loginIn").css("display","block");
	}
	//登录点击
     $("#login").click(function(){
     	event.preventDefault();
     	$("#allMask").css("display","block");
     	$("#pop").css("display","block");
     	//聚焦密码输入框
     	$("#password").focus();
     	var md5 = false;
     	$("#form").submit(function(){
     		event.preventDefault();
     		var pwd = $("#password").val();
     		if(md5 === false){
	     		pwd = hex_md5(pwd);
	     		md5 = true;
     		}
     		$("#password").val(pwd);
//     	    location.href = "login?password="+pwd;
     		
     	    $.ajax({
				url:"login",
				type:"post",
				data:{password:pwd},
				success:function(data){	
					var isLogin = data.isLogin;
					if(isLogin==="true"){
					     $("#loginIn").css("display","none");
	                     $("#loginOut").css("display","block");
	                     location.href = "mainPage";
					}
					else if(isLogin==="false"){
	                    location.href = "mainPage";
						alert("密码错误!");
						$("#loginOut").css("display","none");
	                    $("#loginIn").css("display","block");
					}
				}
	     });
     	});
     	$("#submit").click(function(){
     	    var pwd = $("#password").val();
     	    pwd = hex_md5(pwd);
	     	md5 = true;
	     	$("#password").val(pwd);
	     	$("#form").submit();
     	});
     });
	
	var pirates = $("#pirates").val();
	pirates = JSON.parse(pirates);
	//实现分布:每个页面最多5个容器，每个容器最多3条信息
	//最大页数
	maxPage = (pirates.length%15===0)?(parseInt(pirates.length/15)):(parseInt(pirates.length/15)+1);
	//初始化当前页数
	var localPage = 1;
	//三维数组，用于存储分布信息
	var page = [];
	init();
	console.log(page);
	
	function setContainerCss(dom){
		 var id = Number(dom.attr("id").split("r")[1]);
		 var count = (id%5===0)?5:(id%5);
	     dom.css({
//	     	"margin-top":(62.75*count+114*(count-1))+"px",
	     	"position":"absolute",
	     	"margin-left":(70*count+150*(count-1))+"px",
	     	"width":"150px",
	     	"height":"593px",
	     	"padding":"0",
	     	"z-index":"3"
//	     	"background-color":"brown"
	     });
	}
	
	function setContextCss(dom){
	   var id = Number(dom.attr("id").split("t")[2]);
	   var count = (id%3===0)?3:(id%3);
	   dom.css({
	   	"position":"absolute",
	   	 "margin-top":(35.75*count+(count-1)*150)+"px",
	   	 "width":"150px",
	   	 "height":"150px",
	   	 "color":"#33ccff",
	   	 "font-size":"0",
	   	 "border-radius":"50%",
	   	 "background-color":"#33ccff",
	   	 "text-align":"center",
	   	 "line-height":"150px",
	   	 "z-index":"4"
	   });
	}
	
	//初始化,将信息装进容器，并加载第一页信息
	function init(){
		//页面
		for(var i=0;i<maxPage;i++){
			page[i] = new Array();
			//容器
			for(var j=0;j<5;j++){
				page[i][j] = new Array();
				//容器内信息
			   for(var k=0;k<3;k++){
			   	  if(15*i+3*j+k+1<pirates.length||15*i+3*j+k+1===pirates.length){
			          page[i][j][k] = 	pirates[15*i+3*j+k];   	  	
			   	  }
			   }
			}
		}
	    
		//加载容器
		for(var i=0;i<page[0].length;i++){
	         $("#row2").append("<div class='container' id='container"+(i+1)+"'></div>");
		     setContainerCss($("#container"+(i+1)));
		     //加载信息
		     for(var j=0;j<page[0][i].length;j++){
		         $("#container"+(i+1)).append("<div class='context' id='context"+(3*i+j+1)+"'></div>");
		         $("#context"+(3*i+j+1)).text(page[0][i][j]);
		         setContextCss($("#context"+(3*i+j+1)));
		     }
		}
	}
    
	//鼠标点击事件——右箭头
	$("#button-right").click(function(){
	    if(localPage ===1&&maxPage > 1){
	    	$("#button-left").css("display","block");
	    }
	    if(localPage+1 === maxPage){
	        $("#button-right").css("display","none");
	    }
	    //如果还有下一页
	    if(localPage<maxPage){
		    //让当前页面左移至消失
	    	   //正则表达式来筛选不同页码对应的容器
		    var idReg = new RegExp("^[1-5]$");
		    //此方法在查找上效率太低，只是暂时使用
//		    $("div[id^='container']").each(function(i){
//		    	i = ((i+1)%5===0)?(5):((i+1)%5);
//		    	var id = Number($(this).attr("id").split("r")[1]);
//		    	idTest = id-(localPage-1)*5;
//		    	if(idReg.test(idTest)){
//			    		setTimeout(function(){
//			    	    $("#container"+id).animate({
//			    	    	left:"-="+(70*i+150*i+1)+"px",
//			    	    	opacity:"0"
//			    	    });
//			    	},(i-1)*100);
//		    	}
//		    	
//		    });
		    //jquery选择器精确定位，更加效率
  //问题得到解决——for循环里用setTimeout()需要放在自调用匿名函数里
  //由于setTimeout是模拟异步执行，for是同步执行，等所有for执行结束才
  //执行setTimeout，不符合这里的调用目的，我希望循环中每循环一次就
  //调用一次setTimeout，所以需要放在自调用匿名函数里
              for(var i=(localPage-1)*5+1;i<(localPage-1)*5+6;i++){
              	(function(i){
              	     var count = (i%5===0)?(5):(i%5);
              		 setTimeout(function(){
	                 $("#container"+i).animate({
	                       left:"-="+(70*count+150*count+1)+"px",
	                       opacity:"0"
	                 });
              	},(count-1)*70);
              	})(i);
              }

		   
		    //生成新的容器页面,先判断是否存在
		    if($("#container"+(localPage*5+1)).length===0){
				    //加载容器
					 for(var i=0;i<page[localPage].length;i++){
			         $("#row2").append("<div class='container' id='container"+((localPage*5)+i+1)+"'></div>");
				     setContainerCss($("#container"+((localPage*5)+i+1)));
				     $("#container"+((localPage*5)+i+1)).css({
				        "margin-left":"1170px",
				        "opacity":"0"
				     });
				     //加载信息
				     for(var j=0;j<page[localPage][i].length;j++){
				         $("#container"+(5*localPage+i+1)).append("<div class='context' id='context"+(localPage*15+3*i+j+1)+"'></div>");
				         $("#context"+(localPage*15+3*i+j+1)).text(page[localPage][i][j]);
				         setContextCss($("#context"+(localPage*15+3*i+j+1)));
				     }
				     
				}
		    
		    }
		     
		    //下一页左移出现
		      //此方法在查找上效率太低，暂时使用

//			       $("div[id^='container']").each(function(i){
//			    	i = ((i+1)%5===0)?(5):((i+1)%5);
//			    	var id = Number($(this).attr("id").split("r")[1]);
//			    	idTest = id - 5*localPage;
//			    	if(idReg.test(idTest)){
//				    		setTimeout(function(){
//				    	    $("#container"+id).animate({
//				    	    	left:"-="+(220*(6-i))+"px",
//				    	    	opacity:"1"
//				    	    });
//				    	},(i-1)*100+600);
//			    	}
//			    	
//			    });
                
		         for(var i=(localPage)*5+1;i<(localPage)*5+6;i++){
		         	(function(i){
		         	  	 var count = (i%5===0)?(5):(i%5);
    		         	 setTimeout(function(){
		                 $("#container"+i).animate({
		                       left:"-="+(220*(6-count))+"px",
		                       opacity:"1"
		                 });
		         	  },(count-1)*70+400);
		         	})(i);
		         	
              }
		    
		    //页码加1
		     localPage += 1;
	    }
	});

   //鼠标点击事件——左箭头
	$("#button-left").click(function(){
	   if(localPage===maxPage){
	      $("#button-right").css("display","block");
	   }
	   if(localPage-1===1){
	   	  $("#button-left").css("display","none");
	   }
	   
	    //如果还有上一页
	    if(localPage>1){
		    //让当前页面右移至消失
	    	   //正则表达式来筛选不同页码对应的容器
//		    var idReg = new RegExp("^[1-5]$");
		    //此方法在查找上效率太低，暂时使用
//		    $("div[id^='container']").each(function(i){
//		    	i = ((i+1)%5===0)?(5):((i+1)%5);
//		    	var id = Number($(this).attr("id").split("r")[1]);
//		    	idTest = id-(localPage-1)*5;
//		    	if(idReg.test(idTest)){
//			    		setTimeout(function(){
//			    	    $("#container"+id).animate({
//			    	    	left:"+="+(6-i)*220+"px",
////			    	    	left:"-="+(70*((i+1)%5+1)+150*((i+1)%5)+1)+"px",
//			    	    	opacity:"0"
//			    	    });
//			    	},(5-i)*100);
//		    	}
//		    });
                for(var i=(localPage-1)*5+1;i<(localPage-1)*5+6;i++){
              	(function(i){
              	     var count = (i%5===0)?(5):(i%5);
              		 setTimeout(function(){
	                 $("#container"+i).animate({
	                       left:"+="+(6-count)*220+"px",
	                       opacity:"0"
	                 });
              	},(5-count)*70);
              	})(i);
              }

		     
		     //上一页右移出现
		      //此方法在查找上效率太低，暂时使用

//			       $("div[id^='container']").each(function(i){
//			    	 i = ((i+1)%5===0)?(5):((i+1)%5);
//			    	var id = Number($(this).attr("id").split("r")[1]);
//			    	idTest = id - 5*(localPage-2);
//			    	if(idReg.test(idTest)){
//				    		setTimeout(function(){
//				    	    $("#container"+id).animate({
//				    	    	left:"+="+(70*i+150*i+1)+"px",
//	//			    	    	left:"-="+220*(5-((i+1)%5))+"px",
//				    	    	opacity:"1"
//				    	    });
//				    	},(5-i)*100+600);
//			    	}	
//			    });
                 
              for(var i=(localPage-2)*5+1;i<(localPage-2)*5+6;i++){
		         	(function(i){
		         	  	 var count = (i%5===0)?(5):(i%5);
    		         	 setTimeout(function(){
		                 $("#container"+i).animate({
		                       left:"+="+(70*count+150*count+1)+"px",
		                       opacity:"1"
		                 });
		         	  },(5-count)*70+400);
		         	})(i);
		         	
              }
		    //页码减1
		     localPage -= 1;
	    }
	});
	//鼠标点击事件——页面跳转
	$("#row2").on("click","div[id^='context']",function(){
	    var text = $(this).text();
	    text = encodeURI(encodeURI(text));
	    window.location.href = "showPirate?pirateName="+text;
	});
	//鼠标悬浮事件
	$("#row2").on("mouseenter","div[id^='context']",function(){
		$(this).css({
			"background-color":"rgba(0,0,0,0.5)",
			"font-size":"20px"
			});
	});
	$("#row2").on("mouseout","div[id^='context']",function(){
		$(this).css({
			"background-color":"#33ccff",
			"font-size":"0"
			});
	});
});