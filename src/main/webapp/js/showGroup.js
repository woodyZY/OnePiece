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
	
	var groupName = $("#groupName").val();
	var pirateNameList = $("#pirateNameList").val();
	pirateNameList = JSON.parse(pirateNameList);
	//初始化当前容器编号为1
	local = 1;
	//初始化每个容器包含5条数据
	j = 5;
	maxCount = (pirateNameList.length%5===0)?parseInt(pirateNameList.length/5):(parseInt(pirateNameList.length/5) + 1);
    //当页面元素加载完成就初始化板块2
	scrollPage2Init();
	
	//初始化板块2
	function scrollPage2Init(){
		//统计第二板块的滑动容器个数,全局变量
	    count = 0;
		$("#scrollPage2").append("<div id='scrollContainer"+(count+1)+"'></div>");
		$("#scrollContainer1").css({
		    "position":"absolute",
			"margin-top":"70px",
			"margin-left":"185px",
			"width":"800px",
			"height":"453px",
			"display":"block",
			"z-index":"3"
		});
		count+=1;
		if(maxCount===1){
			j = pirateNameList.length;
		}
		for(var i=0;i<j;i++){
				$("#scrollContainer1").append("<div id='pirate"+(i+1)+"'>"+
				pirateNameList[i]+"</div>");
				$("#pirate"+(i+1)).css({
				   "position":"absolute",
					"margin-top":"0",
					"margin-left":"0"+(i*160)+"px",
					"width":"160px",
					"height":"453px",
					"text-align":"center",
					"line-height":"453px",
					"background-color":"00ffff",
					"border":"solid 1px grey",
					"display":"block",
					"z-index":"4"
				});
		}
	}
	//新增容器
	function newContainer(){
		$("#scrollPage2").append("<div id='scrollContainer"+(count+1)+"'></div>");
		$("#scrollContainer"+(count+1)).css({
		    "position":"absolute",
			"margin-top":"70px",
			"margin-left":"985px",
			"width":"800px",
			"height":"453px",
			"display":"block",
			"opacity":"0",
			"z-index":"3"
		});
		for(var i=0+count*j;i<count*j+j;i++){
				$("#scrollContainer"+(count+1)).append("<div id='pirate"+(i+1)+"'>"+
				pirateNameList[i]+"</div>");
				$("#pirate"+(i+1)).css({
				   "position":"absolute",
					"margin-top":"0",
					"margin-left":"0"+((i-j*count)*160)+"px",
					"width":"160px",
					"height":"453px",
					"text-align":"center",
					"line-height":"453px",
					"background-color":"00ffff",
					"border":"solid 1px grey",
					"display":"block",
					"z-index":"4"
				});
		}
		count+=1;
	}

	//根据海贼团名字，在scrollPage1里加载相应的基本介绍信息
	$("#scrollPage1").text(groupName+"的基本信息！");
	//下箭头点击事件
	$("#button-down").click(function(){
		$("#scrollPage").animate({
		 top:"-593px"
		});
	     //隐藏下箭头，显示上箭头和左右箭头
	    $("#button-down").css("z-index","0");
	    $("#button-up").css("z-index","10");
	    if(count != 1){
	    $("#button-left").css("z-index","10");	    	
	    }
	    $("#button-right").css("z-index","10");

	});
    //上箭头点击事件
	$("#button-up").click(function(){
		$("#scrollPage").animate({
		 top:"0"
		});
	//隐藏下箭头和左右箭头
		$("#button-down").css("z-index","10");
	    $("#button-up").css("z-index","0");
	    $("#button-left").css("z-index","0");
	    $("#button-right").css("z-index","0");
	});
    
	//右箭头点击事件
	$("#button-right").click(function(){
		if(local<maxCount){
			if(local===1){
			    $("#button-left").css("z-index","10");
	     	}
			$("#scrollContainer"+local).animate({
				left:"-=453px",
				opacity:"0"
			});
			if($("#scrollContainer"+(local+1)).length===0){
			   newContainer();
			}
			$("#scrollContainer"+(local+1)).animate({
				left:"-=800px",
				opacity:"1"
			});
			local += 1;
		}
		else{
			$("#scrollContainer"+local).animate({
			    left:"-=30px"
			});
			$("#scrollPage2").append("<div id='error'>没有更多的内容了</div>");
			$("#error").css({
			  "position":"absolute",
			  "width":"30px",
			  "height":"453px",
			  "margin-top":"70px",
			  "margin-left":(985-160*(5-j))+"px",
			  "opacity":"0",
			  "background-color":"#FF6A6A",
			  "z-index":"4"
			});
			$("#error").animate({
			     left:"-=30px",
			     opacity:"1"
			});
			setTimeout(function(){
				$("#scrollContainer"+local).animate({
				  left:"+=30px"
				});
				$("#error").animate({
				  left:"+=30px",
				  opacity:"0"
				});
				$("#error").remove();
			},1000);
			$("#button-right").css("z-index","0");
		}
	});

    //左箭头点击事件
	$("#button-left").click(function(){
		//若下一页是第一页，隐藏左箭头
		if(local === 2){
			$("#button-left").css("z-index","0");
		}
		//若下一页不是最后一页，显示右箭头
		if(local === maxCount){
			$("#button-right").css("z-index","4");
		}
		//滑动动画
		$("#scrollContainer"+local).animate({
			left:"+=800px",
			opacity:"0"
		});
		$("#scrollContainer"+(local-1)).animate({
		    left:"+=453px",
		    opacity:"1"
		});
		local -=1;
	});
    
	//鼠标悬浮事件
	$("#scrollPage").on("mouseenter","div[id^='pirate']",function(){
		$(this).css({
			top:"-=40px"
		});
	});
	$("#scrollPage").on("mouseout","div[id^='pirate']",function(){
		$(this).css({
		  top:"+=40px"
		});
	});
	//鼠标点击事件
	$("#scrollPage").on("click","div[id^='pirate']",function(){
		var pirateName = $(this).text();
		window.location.href = "showPirate?pirateName="+pirateName; 
	});
});