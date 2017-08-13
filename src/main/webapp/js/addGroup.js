$(document).ready(function() {
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
	
	        //用于存储海贼名字
	        pirateArray = new Array();
	        //用于存储海贼职位
	        positionArray = new Array();
	        $("#groupName").after("<span id='isGroupExist' hidden='hidden' style='color:red;' class='error'>此海贼团已存在!</span>");
	        $("#number").after("<span id='warning' hidden='hidden' style='color:red;'>请输入数字！</span>");
			//动态生成成员表
			$("#number").blur(function() {
						var number = $("#number").val();
						var reg=/^[1-9]\d*$|^0$/; 
						//如果已经有成员表，先删除，再根据填的数字重新生成
						$("input[id*='member']").each(function(){
						   $(this).remove();
						});
						$("label[for*='member']").each(function(){
						   $(this).remove();
						});
						$("br").remove();
						if (reg.test(number)==false||number == "0") {
							$("#warning").removeAttr("hidden");
						}
						else{
							$("#warning").attr({"hidden":"hidden"});
							number = Number(number);
							
							for(var i=0;i<number;i++){
								$("#number").after(
						"<div class='form-group'>"+
						    "<label for='memberPosition'>成员职位</label>"+
						    "<input type='text' name='memberPosition' "+
							   "class='form-control'  id='memberPosition" + (number-i) +
							   "'" +
							" placeholder='请输入成员职位'></div>");
							$("#number").after(
						"<div class='form-group'>"+
						    "<label for='memberName'>成员名字</label>"+
						    "<input type='text' name = 'memberName' "+
							   "class='form-control'  id='memberName" + (number-i) +
							   "'" +
							" placeholder='请输入成员名字'></div>");
							}
							$("#number").after("<br>");		
                            //模拟点击动态生成的元素，让动态元素可以被检索到
							$("#memberName0").trigger("click");
							$("input[id^='memberName']").each(function(i){
							        $(this).after("<span hidden='hidden' style='color:red;' class='error' id='nameRepeat"+(i+1)+"'>船员重复</span>");
							        $(this).after("<span hidden='hidden' id='isPirateExist"+(i+1)+"' style='color:red;' class='error'>此海贼不存在!</span>");
							});
							
							
							//处理重复船员，重复的报错，这样数据中没有重复元素，模拟成Set集合
             repeat = new Array();
             $("input[id^=memberName]").on("change",function(){
             	    var id = $(this).attr("id");
             	    var count = id.split("e")[3];
                  	//如果为空数组则添加
                  	if(repeat.length==0){
                  	  repeat.push($(this).val());
                  	}
                  	else{
                  		//如果不为空则查重
	                  	for(var i=0;i<count-1;i++){
	                  	   if(repeat[i]==$(this).val()){
	                  	   	//如果存在则报错并跳出函数
	                  	   	$("#nameRepeat"+count).removeAttr("hidden");
	                  	   	 return;
	                  	   }
	                  	}
	                  	//如果为新元素则添加
	                  	$("#nameRepeat"+count).attr("hidden","hidden");
	                  	repeat[count-1] = $(this).val();
                  	}
                  	 
                  });
							
						}		
				

					});

					
			
			 //检测海贼团名是否为空，不为空则去后台查询是否存在
			$("#groupName").change(function(){
			 		//存储海贼团名字
			 	        var groupName = $(this).val();        
			 	   //禁止输入空值
			 	   if(groupName==null||"".equal==groupName){
			 	       $(this).after("<span id='nullGroup' style='color:red;'>不能为空值！</span>");
			 	   }
			 	   else{
			 	   	//对不为空值的情况，向后台请求查询名字是否存在
			 	     $("#nullGroup").remove();
			 	     $.post(
			 	   "isGroupExist",
			 	   	{"groupName":groupName},
			 	   	function(data){
			 	        if(data.bool=='true'){
			 	        	$("#isGroupExist").removeAttr("hidden");
			 	        }
			 	        else{
			 	            $("#isGroupExist").attr({"hidden":"hidden"});
			 	            
			 	        }
			 	   });
			 	   }
			 	   
			 	});
					
					
            	//采用ajax，将获取到的名字传到后台验证是否存在
			 	//如果不存在则不可加入组织，需要先注册成海贼
			 	//检测输入状态
				//由于动态生成的元素无法绑定blur事件
                //采用change事件
			 	$("#form").on("change","input[id*=memberName]",function(){
			 		//存储成员名字
			 	        var pirateName = $(this).val();
			 	        var id = $(this).attr("id");
             	        var count = id.split("e")[3];
//			 		$("#memberName").each(function(i){
//			 		    pirateName[i] = $(this).val();
//			 		    alert(pirateName[i]);
//			 		})
//			 		return false;
			 	   //禁止输入空值
			 	   if(pirateName==null||"".equal==pirateName){
			 	       $(this).after("<span id='nullString' style='color:red;'>不能为空值！</span>");
			 	   }
			 	   else{
			 	   	//对不为空值的情况，向后台请求查询名字是否存在
			 	     $("#nullString").remove();
			 	     $.post(
			 	   "isPirateExist",
			 	   	{"pirateName":pirateName},
			 	   	function(data){
			 	        if(data.bool=='false'){
			 	        	$("#isPirateExist"+count).removeAttr("hidden");
			 	        }
			 	        else{
			 	            $("#isPirateExist"+count).attr({"hidden":"hidden"});
			 	        }
			 	   });
			 	   }
			 	   
			 	});
			 	
			 	//检测职位是否为空值
			 	$("#form").on("change","input[id*=memberPosition]",function(){
			 		//存储成员职位
			 	        var position = $(this).val();
			 	   //禁止输入空值
			 	   if(position==null||"".equal==position){
			 	       $(this).after("<span id='nullPosition' style='color:red;'>不能为空值！</span>");
			 	   }
			 	   else{
			 	   	//对不为空值的情况，移除报错字段
			 	     $("#nullPosition").remove();
			 	   }
			 	   
			 	});

             //编辑表单提交事件
			 $("#submit").click(function(){
			 	event.preventDefault();
			 	//创建一个FormData对象
			 	var formData = new FormData();
                 //筛选以“memberName”为前缀的元素，遍历列表
			 	$("input[id*=memberName]").each(function(){
                   //获取列表中每个input元素的值，并添加入set集合
			 		var pirateName = $(this).val();
			 		pirateArray.push(pirateName);
			 	    
			 	});
			 	
			 	//获取职位列表
			 	$("input[id*=memberPosition]").each(function(){
                   //获取列表中每个input元素的值，并添加入set集合
			 		var position = $(this).val();
			 		positionArray.push(position);
			 	    
			 	});
			 	//装载数据
			 	formData.append("groupName",$("#groupName").val());
			 	formData.append("positionArray",positionArray);
			 	formData.append("number",$("#number").val());
			 	formData.append("pirateArray",pirateArray);
			 	formData.append("groupImg",document.getElementById("groupImg").files[0]);
                //以post的方式提交表单信息到后台处理
			 	$.ajax({
			 	url:"addGroup",
			 	type:"post",
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
			 		        alert("表格信息有误，请重新填写！");
			 		        window.location.href = "addGroupPage";
			 		}
			 		else{
			 			window.location.href = "adPage";
			 		}
			 	}
			 	});
			 	
			 });
		});