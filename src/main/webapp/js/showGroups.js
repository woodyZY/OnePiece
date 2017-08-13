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
	
	$("#scrollLoad").css({"width":"auto","height":"auto"});
	//初始化
	init();
	//初始化，加载海贼团
	function init(){
		var groups = $("#groupsList").val();
		groups = JSON.parse(groups);
		for(var i=0;i<groups.length;i++){
			$("#scrollLoad").append("<div class='groupRow'>"
			+(i+1)+"、"+"&nbsp"+groups[i]+"</div>");
		}
	}
	//颜色数组
	colorArray = ["red","green","blue","yellow","orange"];
	//记录前一个颜色
	percolor = null;
	//获取随机颜色
	function getRandomColor(){
		var colorId = Math.floor(Math.random()*5);
		var color = colorArray[colorId];
		return color;
	}
	//为每行随机设置颜色
	function setCss(dom){
//		var color = getRandomColor();
//		while(color == percolor){	
//			color = getRandomColor();
//		}
//		percolor = color;
		dom.css({
			"margin-left":"auto",
			"margin-right":"auto",
			"width":"50%",
			"height":"100px",
			"text-align":"center",
			"line-height":"100px",
			"background-color":"#33ccff",
			"border":"solid 1px grey"
		});
	}
	$("#scrollLoad").children(".groupRow").each(function(){
		setCss($(this));
	});
    
    //添加loading
    function loading(){
    	$("#scrollLoad").append("<div class='loading'"+
    	"style='width:50%;height:100px;margin-left:auto;margin-right:auto;text-align:center;'>"+
	    "loading...</div>");
    }
    //添加row来替换loading
    function addRow(){
    	var count = $("#scrollLoad").children().length;
    	$("#scrollLoad").append("<div class='groupRow'>"+"row"+(count+1)+"</div>");
    	setCss($("#scrollLoad").children("div:last-child"));
    	$("#scrollLoad").append("<div class='groupRow'>"+"row"+(count+2)+"</div>");
    	setCss($("#scrollLoad").children("div:last-child"));
    	$("#scrollLoad").append("<div class='groupRow'>"+"row"+(count+3)+"</div>");
    	setCss($("#scrollLoad").children("div:last-child"));
    }
//下拉加载实现————如果 offsetHeight = visualHeight + scrollHeight 则说明已到页面底部
       //全局锁变量，保证未加载出上一次请求的内容之前不允许继续请求
       loadSuccess = true;
    $(window).scroll(function(){
    	//获取页面高度——浏览器所能直接展示的高度
    	var y2 = document.body.clientHeight;
    	//获取展示区域离可视区域的起点的距离
    	var y1 = $("#scrollLoad").css("margin-top").split("p")[0];
        var visualHeight = y2-Number(y1);
    	//获取滚动条滚动距离
    	var scrollHeight = $(this).scrollTop();
    	//获取元素容器总高度——需要展示的所有内容的总高度
    	var offsetHeight = $('#scrollLoad').get(0).offsetHeight;
    	//获取已经显示的海贼团数量，请求显示之后的海贼团
    	var min = $("#scrollLoad").children().length;
    	if(scrollHeight+visualHeight==offsetHeight||(scrollHeight+visualHeight<offsetHeight&&scrollHeight+visualHeight>offsetHeight-10)){
    		var forSearch = $("#forSearch").val();
    		if(forSearch==="true"&&loadSuccess===true){
    			loadSuccess = false;
    		       $("#scrollLoad").append("<div class='row' id='end'>"+"没有更多的内容了！"+"</div>");
    	                setCss($("#scrollLoad").children("div:last-child"));
    	                $("#scrollLoad").children("div:last-child").css("background-color","#F08080");
    	               (function(){
    	                  setTimeout(function(){
    	                	$("#end").remove();
    	                },1000);
    	               })();
    		}
    		else if(forSearch!="true"&&loadSuccess===true){
//		    		if(loadSuccess==true){
		    		loadSuccess = false;
		    		loading();
		    		$.ajax({
		    			type:"post",
		    			url:"loadGroups",
		    			data:{
		    				min:min,
		    				max:3
		    			},
		    			success:function(data){
		    				$(".loading").remove();
		    				//判断返回的数组长度，如果大于0则继续加载内容，否则加载end提醒
		    				if(data.length>0){
			    				for(var i=0;i<data.length;i++){
			    				groupName = data["groupsList["+i+"]"];
			    			    $("#scrollLoad").append("<div class='groupRow'>"
			    			    +(min+i+1)+"、"+"&nbsp"+groupName+"</div>");
						    	setCss($("#scrollLoad").children("div:last-child"));
			    				}
			    				loadSuccess = true;
		    				}
		    				else{
		    					$("#scrollLoad").append("<div class='row' id='end'>"+"没有更多的内容了！"+"</div>");
		    	                setCss($("#scrollLoad").children("div:last-child"));
		    	                $("#scrollLoad").children("div:last-child").css("background-color","#F08080");
		    	                (function(){
		    	                   setTimeout(function(){
		    	                	$("#end").remove();
//		    	                	loadSuccess = true;
		    	                },1000);
		    	                })();
		    				}
		    				
		    			}
		    		});
//		    	}
    		}
    	}
    });
   
    //动态监测鼠标悬浮事件
    $("#scrollLoad").on("mouseenter","div.groupRow",function(){
       $(this).css({
       	"color":"#0000FF",
       	"font-size":"120%",
       	"background-color":"#222222",
       	"border":"solid 1px #222222"
       	});
    });
    $("#scrollLoad").on("mouseout","div.groupRow",function(){
       $(this).css({
         "font-size":"100%",
         "color":"black",
         "background-color":"#33ccff"
       });
    });
    
    //动态检测点击事件
    $("#scrollLoad").on("click","div.groupRow",function(){
    	var groupName = $.trim($(this).text().split("、")[1]);
        window.location.href = "showGroup?groupName="+groupName;
    });
});