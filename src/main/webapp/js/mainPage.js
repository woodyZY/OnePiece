
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
     
	//大纲：页面采用水平轮播图，轮播图包含两部分
	          //左边较大，放置group图；右侧较小放置pirate图
	                   //同时右侧的pirate图也采取轮播图，不过是垂直轮播
	
	//页面初始化，获取group名字列表
	   //采用ajax获取group名字列表
	
     //初始化
     init();
     
     //左右箭头点击事件
        //右箭头
     $("#button-right").click(function(){
     	//如果是第一页则显示左箭头
     	if(localPage===1){
     	  $("#button-left").css("display","block");
     	}
     	//如果当前页码为倒数第二页，则隐藏右箭头
     	if(localPage===maxPage-1){
     		$("#button-right").css("display","none");
     	}
     	//如果下一页不存在则新增
     	if($("#horizontal"+(localPage+1)).length===0){
     	   newHorizontal();
     	}
     	//如果上一页纵向页码为第一页,并且不止一页，则隐藏上箭头，显示下箭头
     	if(localVerticalPage[localPage+1]["verticalPage"]===1&&localVerticalPage[localPage+1]["verticalPage"]<localVerticalPage[localPage+1]["maxPage"]){
     		$("#button-up").css("display","none");
     		$("#button-down").css("display","block");
     	}
     	//如果有且只有一页，则隐藏上下箭头
     	if(localVerticalPage[localPage+1]["maxPage"]===1){
     		$("#button-up").css("display","none");
     		$("#button-down").css("display","none");
     	}
     	//如果上一页纵向页码为最后一页，并且不是第一页，则隐藏下箭头，显示上箭头
     	if(localVerticalPage[localPage+1]["verticalPage"]===localVerticalPage[localPage+1]["maxPage"]
     	&&localVerticalPage[localPage+1]["verticalPage"]!=1){
     		$("#button-down").css("display","none");
     		$("#button-up").css("display","block");
     	}
     	//如果为中间页，则显示上下箭头
     	if(localVerticalPage[localPage+1]["verticalPage"]<localVerticalPage[localPage+1]["maxPage"]&&
     	localVerticalPage[localPage+1]["verticalPage"]>1){
     		$("#button-down").css("display","block");
     		$("#button-up").css("display","block");
     	}
     	
     	//如果有下一页则执行动画
     	if($("#horizontal"+(localPage+1)).length!=0){
	     		//当前页左移至消失
	     	$("#horizontal"+localPage).animate({
	     		left:"-="+1170+"px",
	     		opacity:"0"
	     	});
	     	//下页左移至正中位置
	     	$("#horizontal"+(localPage+1)).animate({
	     		left:"-="+1170+"px",
	     		opacity:"1"
	     	});
	     	//当前页码自增
	     	localPage+=1;
	     	//如果成员列表只有一个，则隐藏下箭头
//	        if(pirates[localPage].length===1){
//	        	$("#button-down").css("display","none");
//	        }
//	        else{
//	        	$("#button-down").css("display","block");
//	        }
     	}
     	
//     	console.log(localPage);
     });
       
        //左箭头
     $("#button-left").click(function(){
     	
     	//如果当前页码为2，则隐藏左箭头
     	if(localPage===2){
     		$("#button-left").css("display","none");
     	}
     	//如果当前页码为最后一页，则显示右箭头
     	if(localPage===maxPage){
     		$("#button-right").css("display","block");
     	}
     	//如果上一页纵向页码为第一页,并且不止一页，则隐藏上箭头，显示下箭头
     	if(localVerticalPage[localPage-1]["verticalPage"]===1&&localVerticalPage[localPage-1]["verticalPage"]<localVerticalPage[localPage-1]["maxPage"]){
     		$("#button-up").css("display","none");
     		$("#button-down").css("display","block");
     	}
     	//如果有且只有一页，则隐藏上下箭头
     	if(localVerticalPage[localPage-1]["maxPage"]===1){
     		$("#button-up").css("display","none");
     		$("#button-down").css("display","none");
     	}
     	//如果上一页纵向页码为最后一页，并且不是第一页，则隐藏下箭头，显示上箭头
     	if(localVerticalPage[localPage-1]["verticalPage"]===localVerticalPage[localPage-1]["maxPage"]
     	&&localVerticalPage[localPage-1]["verticalPage"]!=1){
     		$("#button-down").css("display","none");
     		$("#button-up").css("display","block");
     	}
     	//如果为中间页，则显示上下箭头
     	if(localVerticalPage[localPage-1]["verticalPage"]<localVerticalPage[localPage-1]["maxPage"]&&
     	localVerticalPage[localPage-1]["verticalPage"]>1){
     		$("#button-down").css("display","block");
     		$("#button-up").css("display","block");
     	}
     	//当前页右移至消失
     	$("#horizontal"+localPage).animate({
     		left:"+="+1170+"px",
     		opacity:"0"
     	});
     	//上一页右移至正中
     	$("#horizontal"+(localPage-1)).animate({
     		left:"+="+1170+"px",
     		opacity:"1"
     	});
     	//当前页码自减
     	localPage -=1;
     	//如果成员列表只有一个，则隐藏下箭头
//	        if(pirates[localPage].length===1){
//	        	$("#button-down").css("display","none");
//	        }
//	        else{
//	        	$("#button-down").css("display","block");
//	        }
//     	console.log(localPage);
     });

     //上下箭头事件
        //下箭头  
     $("#button-down").click(function(){
     	//如果当前纵向页码为第一页，则显示上箭头
     	if(localVerticalPage[localPage]["verticalPage"]===1){
     		$("#button-up").css("display","block");
     	}
     	//如果当前纵向轮播图页码为倒数第二页，则隐藏下箭头,显示上箭头
     	if(localVerticalPage[localPage]["verticalPage"]===localVerticalPage[localPage]["maxPage"]-1){
     		$("#button-down").css("display","none");
     		$("#button-up").css("display","block");
     	}
     	//如果当前页码+1不大于最大页码，则可以新增
     	if($(document.getElementById("vertical"+localPage+"-"+(localVerticalPage[localPage]["verticalPage"]+1))).length===0){
     		newVertical($("#horizontal"+localPage),false);
     	}
     	//当前页下移至消失
     	   //由于动态元素无法用jquery选择器直接获取，所以用js方法先获取dom
     	  //然后用var $dom = $(dom)来转换成jquery对象
     	//如果有下一页则执行动画
     	if($(document.getElementById("vertical"+localPage+"-"+(localVerticalPage[localPage]["verticalPage"]+1))).length!=0){
     		var id = document.getElementById("vertical"+localPage+"-"+localVerticalPage[localPage]["verticalPage"]);
     	$(id).animate({
     		top:"+="+593+"px",
     		opacity:"0"
     	});
     	//下一页下移至正中
     	$(document.getElementById("vertical"+localPage+"-"+(localVerticalPage[localPage]["verticalPage"]+1))).animate({
     		top:"+="+593+"px",
     		opacity:"1"
     	});
     	//当前页码自增
     	localVerticalPage[localPage]["verticalPage"]+=1;
     	console.log(localVerticalPage[localPage]["verticalPage"]);
     	}
     	
     });
     
        //上箭头
     $("#button-up").click(function(){
     	//如果当前页码为第二页，则隐藏上箭头,显示下箭头
     	if(localVerticalPage[localPage]["verticalPage"]===2){
     		$("#button-up").css("display","none");
     		$("#button-down").css("display","block");
     	}
     	//如果当前页码为最后一页，则显示下箭头
     	if(localVerticalPage[localPage]["verticalPage"]===localVerticalPage[localPage]["maxPage"]){
     		$("#button-down").css("display","block");
     	}
     	//当前页上移至消失
     	$(document.getElementById("vertical"+localPage+"-"+localVerticalPage[localPage]["verticalPage"])).animate({
     		top:"-="+593+"px",
     		opacity:"0"
     	});
     	//上一页上移至正中
     	$(document.getElementById("vertical"+localPage+"-"+(localVerticalPage[localPage]["verticalPage"]-1))).animate({
     		top:"-="+593+"px",
     		opacity:"1"
     	});
     	//页码自减
     	localVerticalPage[localPage]["verticalPage"]-=1;
     	console.log(localVerticalPage[localPage]["verticalPage"]);
     });
     
     //初始化第一页  横向:horizontal 纵向:vertical
     function init(){
     	    //隐藏左箭头和上箭头
     	   $("#button-left").css("display","none");
     	   $("#button-up").css("display","none");
         	groups = [];
	     	$.ajax({
				url:"showGroupsForInit",
				type:"post",
				async:false,
				data:{},
				success:function(data){	
					groups = data.groups;
				}
	     });
	     //记录最大页码为groups列表的长度
	     maxPage = groups.length;
     	//记录当前水平轮播图当前页码
	     localPage = 1;
	     
	     //轮播图编号
	     horizontalCount = 1;
	     //存储对象的数组，来表示垂直轮播图编号
	     horizontal = [];
	     //下标1表示编号为1的水平轮播图，键“vertical”的值表示垂直轮播图编号
	     horizontal[1] = {"vertical":1};
	     //数组用于存储每个group对应的成员列表
	     pirates = [];
	     //每新增一个水平轮播图就向后台请求对应的group成员列表
	     $.ajax({
	     	url:"showPiratesForInit",
			type:"post",
			async:false,
			data:{"groupName":groups[horizontalCount-1]},
			success:function(data){
				//从1开始而不是0开始，因为和页码对应
				pirates[horizontalCount] = data.pirates;
			}
	     });
//	     console.log(pirates[horizontalCount].length);
	     //如果成员列表只有一个，则隐藏下箭头
        if(pirates[horizontalCount].length===1){
        	$("#button-down").css("display","none");
        }
        else{
        	$("#button-down").css("display","block");
        }
	     //记录当前垂直轮播图页码，数组下标对应水平页码，对象键值对应垂直页码
	     localVerticalPage = [];
	     localVerticalPage[horizontalCount] = {"verticalPage":1,"maxPage":pirates[horizontalCount].length};
	     //新增轮播图
	     $("#row2").append("<div class='horizontal' id='horizontal"+horizontalCount+"'></div>");
         horizontalSetCss($("#horizontal"+horizontalCount));
         $("#horizontal"+horizontalCount).css("opacity","1");
         //添加左边部分
         $("#horizontal"+horizontalCount).append("<div class='group' id='group"+horizontalCount+"'></div>");
         showGroupSetCss($("#group"+horizontalCount));
         $("#group"+horizontalCount).text(groups[horizontalCount-1]);
         //垂直轮播图编号采用1-1的性质，前一个数字为水平轮播图编号，后一个为垂直轮播图编号
         $("#horizontal"+horizontalCount).append("<div class='vertical' id='vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]+"'></div>");
         
         verticalSetCss($("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]));
         $("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]).text(pirates[horizontalCount][0]);
     }
     //横向轮播图设置样式
     function horizontalSetCss(dom){
     	var count = Number($.trim(dom.attr("id").split("l")[1]));
        dom.css({
        	"position":"absolute",
        	"width":"1170px",
        	"height":"593px",
        	"background-color":"grey",
        	"color":"black",
        	"opacity":"0",
        	"z-index":"3"
        });
        if(count != 1){
        	dom.css({
        		"margin-left":"1170px"
        	});
        }
     }
     //横向轮播图左边部分设置样式
     function showGroupSetCss(dom){
        dom.css({
           "position":"absolute",
           "width":"780px",
           "height":"593px",
           "margin-left":"0",
           "z-index":"4",
           "background-color":"#F86731"
        });
     }
     
     //纵向轮播图设置样式
     function verticalSetCss(dom){
//     	var $dom = $(dom);
     	var count = Number($.trim(dom.attr("id").split("-")[1]));
     	dom.css({
     		"position":"absolute",
     		"width":"390px",
     		"height":"593px",
     		"margin-left":"780px",
     		"z-index":"4",
     		"background-color":"#E8F2FE"
     	});
     	if(count!=1){
     		dom.css({
     			"margin-top":"-593px"
     		});
     	}
     }
     //新增横向轮播图
     function newHorizontal(){
     	horizontalCount +=1;
     	//每新增一个水平轮播图就向后台请求对应的group成员列表
	     $.ajax({
	     	url:"showPiratesForInit",
			type:"post",
			async:false,
			data:{groupName:groups[horizontalCount-1]},
			success:function(data){
				//从1开始而不是0开始，因为和页码对应
				pirates[horizontalCount] = data.pirates;
			}
	     });
     	$("#row2").append("<div class='horizontal' id='horizontal"+horizontalCount+"'></div>");
        horizontalSetCss($("#horizontal"+horizontalCount));
        //新增左边部分
        newGroup($("#horizontal"+horizontalCount));
        //新增纵向轮播图,并隐藏上箭头
        newVertical($("#horizontal"+horizontalCount),true);
        $("#button-up").css("display","none");
        
        
     }
     
     //新增左边部分
     function newGroup(dom){
     	dom.append("<div class='group' id='group"+horizontalCount+"'></div>");
        showGroupSetCss($("#group"+horizontalCount));
        $("#group"+horizontalCount).text(groups[horizontalCount-1]);
     }
     
     //新增纵向轮播图
     function newVertical(dom,bool){
     	//如果为真，说明是第一次新增，则序号为1
     	if(bool===true){
     		horizontal[horizontalCount] = {"vertical":1};
     		localVerticalPage[horizontalCount] = {"verticalPage":1,"maxPage":pirates[horizontalCount].length};
     		dom.append("<div class='vertical' id='vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]+"'></div>");
//     		 var  a = $("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]);
	     	verticalSetCss($("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]));
//	     	verticalSetCss(document.getElementById("vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]));
	     	//垂直轮播图序号减一，对应成员列表中的成员下标
	     	$(document.getElementById("vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"])).text(pirates[horizontalCount][0]);
     	}
     	//否则递增
     	else{
     		//自增已存在的纵向轮播图的个数 
     		  //获取水平轮播图的id
     	   horizontalCount = Number(dom.attr("id").split("l")[1]);
     	   horizontal[horizontalCount]["vertical"]+=1;
     	  dom.append("<div class='vertical' id='vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]+"'></div>");
//     	  var  a = $("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]);
	     	verticalSetCss($("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]));
//	     	verticalSetCss(document.getElementById("vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]));
	     	//垂直轮播图序号减一，对应成员列表中的成员下标
	     	$("#vertical"+horizontalCount+"-"+horizontal[horizontalCount]["vertical"]).text(pirates[horizontalCount][horizontal[horizontalCount]["vertical"]-1]);
     	}
     	
     }

     //轮播图轮播事件
     function loop(){
     	
     }
     
     //鼠标点击事件
        //水平轮播图点击
     $("#row2").on("click","div[id^='group']",function(){
     	var text = $(this).text();
     	location.href = "showGroup?groupName="+text;
     });
        //垂直轮播图点击
     $("#row2").on("click","div[id^='vertical']",function(){
        var text = $(this).text();
        location.href = "showPirate?pirateName=" + text;
     });
      
});