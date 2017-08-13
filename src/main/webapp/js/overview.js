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
	
	//鼠标悬浮触发事件----图片向中心放大浮动，显示文字
	$(".rowmask").mouseenter(function(){
		var name = $.trim($(this).attr("class").split("-")[0].split("k")[1]);
		$("#"+name).children("div:first-child").first().css({"display":"block"});
	});
    //鼠标离开事件----图片恢复，文字隐藏
	$(".rowmask").mouseout(function(){
		var name = $.trim($(this).attr("class").split("-")[0].split("k")[1]);
	   $("#"+name).children("div:first-child").first().css({"display":"none"});
	});
    
	
	//点击事件
	$(".rowmask").click(function(){
		var name = $.trim($(this).attr("class").split("-")[0].split("k")[1]);
	   var text = $("#"+name).find("div.text").first().text();
	   if(text != "海贼"){
	       url = "showGroup";
	   }
	   else{
	   	   url = "showGroups";
	   }
	   //重定向
	   window.location.href = url + "?text=" + text;
	});
	
});