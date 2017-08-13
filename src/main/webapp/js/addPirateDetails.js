$(document).ready(function() {
	//判断管理员登录状态，如果登录成功则在导航条显示管理权限：查看和新增
	if($("#isLogin").val()==="true"){
	    $("#loginIn").css("display","none");
	    $("#loginOut").css("display","block");
	}
	else if($("#isLogin").val()==="false"){
		alert("密码错误!");
	    $("#loginOut").css("display","none");
	    $("#loginIn").css("display","block");
	}
	//登录点击
     $("#login").click(function(){
     	event.preventDefault();
     	$("#allMask").css("display","block");
     	$("#pop").css("display","block");
     	$("#pwdSubmit").click(function(){
     	   $("#adPwd").submit();
     	});
     });        
	
	        $("#skillsSet").after("<span id='warning' hidden='hidden' style='color:red;'>请输入不为0的数字！</span>");
			//根据填写的数字，添加相应数量的成员表
			$("#skillsSet").change(function() {
						var number = $("#skillsSet").val();
						var reg=/^[1-9]\d*$|^0$/; 
						//如果已经有成员表，先删除，再根据填的数字重新生成
						$("input[id^='skill']").not("[id$='Set']").each(function(){
						   $(this).remove();
						});
						$("label[for^='skill']").not("[id$='Set']").each(function(){
							var val = $(this).text();
							if(val !="技能"){
							   $(this).remove();
							}
						   
						});
						$("br").remove();
						//判断用户输入是否为数字或0
						if (reg.test(number)==false||number == "0") {
							$("#warning").removeAttr("hidden");
						}
						else{
							$("#warning").attr({"hidden":"hidden"});
							number = Number(number);
							//动态生成技能输入框
							for(var i=0;i<number;i++){
								$("#skillsSet").after(
						"<div class='form-group'>"+
						    "<label for='skill"+(number-i)+"'>技能"+(number-i)+"</label>"+
						    "<input type='text' name='skill' "+
							   "class='form-control'  id='skill" + (number-i) +
							   "'" +
							" placeholder='请输入技能'></div>");
							}
							$("#skillsSet").after("<br>");		
                            //模拟点击事件,点击动态生成的元素，让动态元素可以被监测到
							$("#skill0").trigger("click");
							//为每个技能添加报错字段，防止重复
							$("input[id^=skill]").not("[id$='t']").each(function(i){
             	               $(this).after("<span hidden='hidden' style='color:red;' id='skill"+(i+1)+"Repeat' class='error'>技能重复</span>");
             });
            //处理重复技能，重复的报错，这样数据中没有重复元素，模拟成Set集合
             repeat = new Array();
             
             
             $("input[id^=skill]").not("[id$='t']").on("change",function(){
             	    var id = $(this).attr("id");
             	    var count = id.split("l")[2];
                  	//如果为空数组则添加
                  	if(repeat.length==0){
                  	  repeat.push($(this).val());
                  	}
                  	else{
                  		//如果不为空则查重
	                  	for(var i=0;i<count-1;i++){
	                  	   if(repeat[i]==$(this).val()){
	                  	   	//如果存在则报错并跳出函数
	                  	   	$("#"+id+"Repeat").removeAttr("hidden");
	                  	   	 return;
	                  	   }
	                  	}
	                  	//如果为新元素则添加
	                  	$("#"+id+"Repeat").attr("hidden","hidden");
	                  	repeat[count] = $(this).val();
                  	}
                  	 
                  })
						}		
					});
             
             //编辑表单提交事件
			 $("#form").submit(function(){
			 	event.preventDefault();
			 	//js中没有集合定义，可以用数组模拟
			 	//SkillsSet = new Set();
			 	skillsArray = new Array();
                 //筛选id以“skill”为前缀的元素，遍历列表
			 	$("input[id^=skill]").not("[id$='t']").each(function(){
                   //获取列表中每个input元素的值，并添加入set集合
			 		var skill = $(this).val();
			 		//技能列表
			 		skillsArray.push(skill);    
			 	});	
                //以post的方式提交表单信息到后台处理
			 	$.ajax({
			 	url:"addPirateDetails",
			 	type:"post",
			 	contentType : "application/x-www-form-urlencoded" ,
			 	traditional:true,
			 	data:{
			 		pirateName:$("#pirateName").val(),
			 		story:$("#story").val(),
			 		weapon:$("#weapon").val(),
			 		skillsArray:JSON.stringify(skillsArray)
			 	},
			 	success:function(data){
			 		if(data.bool=="false"){
			 		        alert("表格信息有误，请重新填写！");
			 		        return false;
			 		}
			 		else{
			 			window.location.href = "mainPage";
			 		}
			 	}
			 });
			 	
			 });
		});