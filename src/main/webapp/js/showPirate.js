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
	
	var pirateInfo = $("#pirate").val();
	//插入海贼图片
	pirateInfo = JSON.parse(pirateInfo);
	var src = pirateInfo["pirateImg"];
	$("#left-img").append("<img style='width:100%;height:100%' src='"+src+"'>");
    skills = pirateInfo["skills"];
    skills = skills.join(",");
    skills = skills.replace("[","");
    skills = skills.replace("]","");
    skills = skills.split("\"").join("");
	//为每行导入信息
	$("#pirateName").append("<div>"+pirateInfo["pirateName"]+"</div>");
	if(pirateInfo["groupName"]==null){
	  $("#groupName").append("<div>"+"未加入海贼团"+"</div>");
	}
	else{
		$("#groupName").append("<div>"+pirateInfo["groupName"]+"</div>");
	}
	$("#position").append("<div>"+pirateInfo["position"]+"</div>");
	$("#bounty").append("<div>"+pirateInfo["bounty"]);
	$("#weapon").append("<div>"+pirateInfo["weapon"]+"</div>");
	$("#skills").append("<div>"+skills+"</div>");
	$("#story").append("<div>"+pirateInfo["story"]+"</div>");
	//设置内容居中和模块的高度位置
	$(".row-info").each(function(i){
	   $(this).css({
	      "line-height":$(this).css("height"),
	      "margin-top":(i*80)+"px"
	   });
	});
	//网页加载完成时，每行从右依次滑入动画
	$("#right-info").children().each(function(i){
		var that = this;
		setTimeout(function(){
			$(that).animate({
				left:"-=866px"
			});
		},i*100);
	});
	
});