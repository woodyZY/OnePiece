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
	    location.href = "mainPage";
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
	
	$("#pirateName").after("<span id='isPirateExist_false' hidden='hidden' style='color:green;'>此名字可用!</span>");
	$("#pirateName").after("<span id='isPirateExist_true' hidden='hidden' style='color:red;'>此名字已存在!</span>");
	//自jquery1.6版本后，attr和prop的定义区别明显，attr用于操作html中可见的属性（已定义）
	//而prop用于操作不可见的属性
	$("#check").prop("checked",false);
	//海贼名字查重
	$("#pirateName").change(function(){
		var pirateName = $.trim($(this).val());
		
		//禁止输入空值
		if(pirateName==null||pirateName==""){
			 	       $(this).after("<span id='nullString' style='color:red;'>不能为空值！</span>");
			 	   }
		else{
			//对不为空值的情况，向后台请求查询名字是否存在
			$("#nullString").remove();
			$.post(
				 	   "isPirateExist",
				 	   	{"pirateName":pirateName},
				 	   	function(data){
				 	        if(data.bool=='true'){
				 	        	//海贼已存在
				 	        	$("#isPirateExist_true").removeAttr("hidden");
				 	        	$("#isPirateExist_false").attr({"hidden":"hidden"});
				 	        }
				 	        else{
				 	        	//海贼不存在
				 	        	$("#isPirateExist_false").removeAttr("hidden");
				 	            $("#isPirateExist_true").attr({"hidden":"hidden"});
				 	        }
				 	   });
		}
	});

	//选填海贼团名，没打勾就不能填海贼团和职位
	$("#check").change(function(){	
		var bool = $(this).prop("checked");
		if(bool==false){
			$("#groupName").attr({"disabled":"disabled"});
			$("#position").attr({"disabled":"disabled"});
		}
		else{
			$("#groupName").removeAttr("disabled");
			$("#position").removeAttr("disabled");
		}
	});
	
	//查询海贼团是否存在
	$("#groupName").after("<span id='isGroupExist' hidden='hidden' style='color:red;'>此海贼团不存在!</span>");
	$("#groupName").change(function(){
		var groupName = $(this).val();
		
		//禁止输入空值
		if(groupName==null||"".equal==groupName){
			 	       $(this).after("<span id='nullString' style='color:red;'>不能为空值！</span>");
			 	   }
		else{
			//对不为空值的情况，向后台请求查询名字是否存在
			$("#nullString").remove();
			$.ajax({
				 	    url:"isGroupExist",
				 	    type:"post",
					 	contentType : "application/x-www-form-urlencoded; charset=UTF-8" ,
					 	traditional:true,
				 	   	data:{groupName:$("#groupName").val()},
				 	   	success:function(data){
				 	        if(data.bool=='false'){
				 	        	$("#isGroupExist").css("display","block");
				 	        }
				 	        else{
				 	            $("#isGroupExist").css("display","none");				 	        }
				 	   }
				 	   });
		}
	});
    
	//编辑表单提交
	$("#submit").click(function(){
		event.preventDefault();
		var pirateName = $("#pirateName").val();
		var groupName = $("#groupName").val();
		var position = $("#position").val();
		var bounty = parseInt($("#bounty").val());
		//unit代表贝利的单位
		var unit = $("select").val();
		if(unit=="亿贝利"){
		  bounty = bounty * Math.pow(10,8);
		}
		else if(unit=="万贝利"){
			bounty = bounty * Math.pow(10,4);
		}
		else{
			bounty = bounty * 1;
		}
		var formData = new FormData();
		formData.append("pirateName",pirateName);
		formData.append("groupName",groupName);
		formData.append("position",position);
		formData.append("bounty",bounty);
		formData.append("pirateImg",$("#pirateImg")[0].files[0]);
		$.ajax({
				url:"addPirate",
				type:'post',
				
				data:formData,
				 /**
                *必须false才会自动加上正确的Content-Type
                */
		       contentType : false ,
		 	   /**
                * 必须false才会避开jQuery对 formdata 的默认处理
                * XMLHttpRequest会对 formdata 进行正确的处理
                */
		 	   processData: false,
				success:function(data){
				    if(data.bool=="false"){
				        alert("表单填写错误，请重新填写！");
				        window.location.href = "addPiratePage";
				    }
				    else{
				    	url = "addPirateDetailsPage?pirateName="+pirateName;
				    	window.location.href = url;
				    }
				}
		});
	});
});