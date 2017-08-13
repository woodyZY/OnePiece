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
	
	//搜索图标点击事件
	  //全局变量，初始化搜素框没有展开
	var search = false;
	
	$("#search").click(function(){
		if(search === false){
			//搜索图标右移并缩小
			$("#search").animate({
			  "left":"+=70px",
			  "top":"+=20px",
			  "width":"30px",
			  "height":"30px"
			},500,'easeOutCirc',function(){
				  //显示搜索框
				    $("#searchInput").animate({
					  "width":"+=120px",
					  "left":"-=120px",
					  "opacity":"1"
					},500,'easeOutCirc',function(){
					    $("#searchString").focus();
					});
			});
			$("#searchIcon").animate({
			   "top":"-=20px",
			   "font-size":"15px"
			},500,'easeOutCirc');
			
			search = true;
		}
		else{
			var text = $("#searchString").val();
			var id = "";
			$("div[id^='groupContainer']").each(function(){
			  var that = this;
			  var str = $(this).text();
			  if(str.indexOf(text)!= -1){
			  	 id = Number($.trim($(that).attr("id").split("r")[2]));
			  	 location.href = "show#anchor"+id;
                 $("#group"+id).click();
                 return false;
			  }
			});
	       
		}
	});
	    $("#showBlack").click(function(){
	    	if(search===true){
	    		//图标左移放大
	    	$("#searchInput").animate({
	              "width":"-=120px",
	              "left":"+=120px",
	 			  "opacity":"0"
				},500,'easeOutCirc',function(){
					//隐藏搜索框
				  $("#search").animate({
					  "left":"-=70px",
					  "top":"-=20px",
					  "width":"70px",
					  "height":"70px"
					},500,'easeOutCirc');
					$("#searchIcon").animate({
				   "top":"+=20px",
				   "font-size":"25px"
				},500,'easeOutCirc');
				  $("#searchString").val('');
				});
				
				
				search = false;
	    	}
	    });
	    $("#showGroups").click(function(){
	    	if(search===true){
	         $("#searchInput").animate({
	              "width":"-=120px",
	              "left":"+=120px",
	 			  "opacity":"0"
				},500,'easeOutCirc',function(){
				  $("#search").animate({
					  "left":"-=70px",
					  "top":"-=20px",
					  "width":"70px",
					  "height":"70px"
					},500,'easeOutCirc');
					$("#searchIcon").animate({
				   "top":"+=20px",
				   "font-size":"25px"
				},500,'easeOutCirc');
				$("#searchString").val('');
				});
				
				
				search = false;
	    	}
	    });
	
	 //展示界面   
	     //初始化
	    init();
	    
	    function init(){
	    	var groups = $("#groups").val();
	    	groups = JSON.parse(groups);
	    	for(var i=0;i<groups.length;i++){
	    		var str = "<div id='groupContainer"+(i+1)+"'></div>";
	    		$("#showGroups").append(str);
	    		setGroupContainerCss($("#groupContainer"+(i+1)));
	    		var str2 = "<div id='group"+(i+1)+"'>"+groups[i]+"</div>";
	    		$("#groupContainer"+(i+1)).append(str2);
	    		setGroupCss($("#group"+(i+1)));
	    		//设置定位锚点
	    		$("#group"+(i+1)).append("<div id='anchor"+(i+1)+"'></div>");
	    		$("#anchor"+(i+1)).css({
	    		  "position":"absolute",
	    		  "margin-top":"-500px",
	    		  "width":"50px",
	    		  "height":"50px",
	    		  "z-index":"3"
	    		});
	    	}
	        
	    }
	    
	    function setGroupCss(dom){
//	    	var  id = Number($.trim(dom.attr("id").split("p")[1]));
	    	//行数
//	    	var lineCount = (id%3===0)?(id/3):(parseInt(id/3)+1);
	    	//列数
//	    	var rowCount = (id%3===0)?3:(id%3);
	    	dom.css({
	    		"position":"absolute",
	    		"width":"250px",
	    		"height":"250px",
	    		"margin-top":"85px",
	    		"margin-left":"102.5px",
	    		"border-radius":"50%",
	    		"text-align":"center",
	    		"line-height":"250px",
	    		"background-color":"#7ABDFF",
	    		"color":"black",
	    		"z-index":"5"
	    	});
	    }
	    
	    function newModify(dom,id){
	    	var str = "<div id='modify"+id+"'></div>";
	    	dom.append(str);
	    	$("#modify"+id).css({
	    	   "position":"absolute",
	    	   "width":"200px",
	    	   "height":"250px",
	    	   "margin-top":"85px",
	    	   "mragin-left":"127.5px",
	    	   "z-index":"4"
	    	});
	    	var str2 = "<div id='modify"+id+"-";
	    	var str3 = "'>";
	    	var str4 = "查看</div>";
	    	for(var i=1;i<4;i++){
	    		 if(i===1){
	    		   str4 = "查看</div>";
	    		 }
	    		 else if(i===2){
	    		   str4 = "修改</div>";
	    		 }
	    		 else{
	    		   str4 = "删除</div>";
	    		 }
	    	     $("#modify"+id).append(str2+i+str3+str4);
	    	     $("#modify"+id+"-"+i).css({
	    	        "position":"absolute",
	    	        "width":"250px",
	    	        "height":"60px",
	    	        "text-align":"center",
	    	        "line-height":"60px",
	    	        "margin-top":(i-1)*95+"px",
	    	        "margin-left":"0",
	    	        "color":"#333333",
	    	        "box-shadow":"2px 3px 10px #7ABDFF",
	    	        "background-color":"#00afd8",
	    	        "opacity":"0",
	    	        "z-index":"4"
	    	     });
	    	}
	    	
	    }
	    
	    function setGroupContainerCss(dom){
	    	var  id = Number($.trim(dom.attr("id").split("r")[2]));
	    	//行数
	    	var lineCount = (id%3===0)?(id/3):(parseInt(id/3)+1);
	    	$("#showGroups").css("height",420*lineCount+"px");
	    	//列数
	    	var rowCount = (id%3===0)?3:(id%3);
	    	dom.css({
	    		"position":"absolute",
	    		"width":"455px",
	    		"height":"420px",
	    		"margin-top":(lineCount-1)*420+"px",
	    		"margin-left":(rowCount-1)*455+"px",
	    		"background-color":"#333333",
	    		"z-index":"4"
	    	});
	    }
         
	    function menuClose(id){
	    	//同时让菜单散开
          	$("#modify"+id+"-"+1).animate({
          	    "top":"+=30px",
          	    "opacity":"0"
          	},200);
          	$("#modify"+id+"-"+2).animate({
	          	    "left":"-=50px",
	          	    "opacity":"0"
	        },200);
           $("#modify"+id+"-"+3).animate({
	          	        "top":"-=30px",
	          	        "opacity":"0"
	          	},200,function(){
	          		//修改菜单右移并显现
	          	     $("#modify"+id).animate({
      	                "left":"-=150px"
                     },200,function(){
                     	$("#group"+id).animate({
				          	"width":"250px",
				          	"height":"250px",
				           "left":"+=85px",
				           "line-height":"250px",
				           "top":"-=35px"
				         },function(){
				            
				         });
                     });
	        });
	    	
	         
	    }
	    
	    //海贼团点击事件
	         //全局变量用来记忆当前展开的修改菜单
	        localMenu = 0;
	    $("div[id^='group']").not("div[id^='groupPage']").not("div[id^='groupContainer']").click(function(){
	    	//先关闭上一个菜单
	    	menuClose(localMenu);
	    	var id = Number($.trim($(this).attr("id").split("p")[1]));
	    	localMenu = id;
	    	//如果不存在浮动显示的修改菜单则新建
	    	if($("#modify"+id).length===0){
	    	  newModify($("#groupContainer"+id),id);
	    	}
	    	//圆形图标左移
	          $(this).animate({
	          	"width":"180px",
	          	"height":"180px",
	           "left":"-=85px",
	           "line-height":"180px",
	           "top":"+=35px"
	          },200,function(){
	          	//修改菜单右移并显现
	          	$("#modify"+id).animate({
	          	     "left":"+=150px"
	          	},200,function(){
	          		 //同时让菜单散开
		          	$("#modify"+id+"-"+1).animate({
		          	    "top":"-=30px",
		          	    "opacity":"1"
		          	});
		          	$("#modify"+id+"-"+2).animate({
			          	    "left":"+=50px",
			          	    "opacity":"1"
			        });
		           $("#modify"+id+"-"+3).animate({
			          	        "top":"+=30px",
			          	        "opacity":"1"
			          	});
		          	});
	          	
	          });
	        
	    });

        //菜单的鼠标悬浮事件
	    $("#showGroups").on("mouseenter","div[id*='-']",function(){
	    	var that = this;
	          $(that).css({
	            "background-color":"white",
	            "color":"#7ABDFF"
	          });
	          $(that).on("mouseout",function(){
	             $(that).css({
	             	"background-color":"#00afd8",
	             	"color":"#333333"
	             });
	          });
	    });

       //菜单点击事件
	    $("#showGroups").on("click","div[id*='-']",function(){
	        var that = this;
	        var id = Number($.trim($(that).attr("id").split('-')[0].split("y")[1]));
	        var id2 = Number($.trim($(that).attr("id").split('-')[1]));
	        var groupName = $("#group"+id).text();
	        //查看命令
	        if(id2===1){
	             location.href = "showGroup?groupName="+groupName;
	        }
	        //修改命令
	        else if(id2===2){
	             location.href = "modifyGroup?groupName="+groupName;
	        }
	        //删除命令
	        else if(id2===3){
	        	if(confirm("确定要删除吗？")){
		            menuClose(id);
		            $("#group"+id).fadeOut(500,function(){
				            location.href = "deleteGroup?admin=true&groupName="+groupName;
		            });
	        	
	        	}
	        }
	    });

        //锚点回到页面顶端
	    $(window).scroll(function(){
	       if($(this).scrollTop()>0){
	       	  if($("#toTop").length===0){
		       	    $("#showGroups").append("<div id='toTop'>" +
		       	            "<a id='top' href='show#row1'  name='row1'’>" +
		       	            "<span style='line-height:50px;'  class='glyphicon glyphicon-menu-up' aria-hidden='true'></span>"+
		       	            "</a>"
		       	    		+"</div>");
		       	    $("#toTop").css({
		       	        "position":"fixed",
		       	        "margin-top":"400px",
		       	        "margin-left":"1300px",
		       	        "width":"50px",
		       	        "height":"50px",
		       	        "font-size":"30px",
		       	        "background-color":"#78ADFF",
		       	        "text-align":"center",
		       	        "line-height":"50px",
		       	        "z-index":"10"
		       	    });
	       	  }
	       	  else{
	       	    $("#toTop").show();
	       	  }
	       }
	    });

       //锚点点击事件
	    $("#showGroups").on("click","#top",function(){
	    	$("#toTop").hide();
//	       $("html,body").animate({scrollTop: $("#groupContainer1").offset().top}, 1000);
	    });
	    //到顶部则隐藏锚点
	    $(window).scroll(function(){
	    	var distance = $(this).scrollTop();
	    	if(distance===0){
	    	  $("#toTop").hide();
	    	}
	    });
});