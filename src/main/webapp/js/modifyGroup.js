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
     
     //初始化
     var pirateNameList = $("#pirates").val();
     pirateNameList = JSON.parse(pirateNameList);
     var positionList = $("#position").val();
     positionList = JSON.parse(positionList);
     var captain = $("#captain").val();
     captain = JSON.parse(captain);
     init();
     
     function setPirateCss(dom){
     	var id = Number($.trim(dom.attr("id").split("e")[1]));
     	dom.css({
//     	  "position":"absolute",
//     	  "margin-left":(id-1)*100+"px",
     	  "float":"left",
     	  "width":"100px",
     	  "height":"593px",
     	  "background-color":"#7ABDFF",
     	  "border":"solid 1px white",
     	  "line-height":"593px",
     	  "text-align":"center",
     	  "color":"black",
     	  "z-index":"4"
     	});
     }
     function addDelete(dom){
     	var id  = Number(dom.attr("id").split("e")[1]);
         dom.append("<div id='delete"+id+"'><span class='glyphicon glyphicon-remove' aria-hidden='true'>"
					+"</span></div>");
		$("#delete"+id).css({
		    "position":"absolute",
		    "margin-left":"25px",
		    "margin-top":"-272px",
		    "width":"50px",
		    "height":"50px",
		    "font-size":"20px",
		    "display":"none"
		});
     }
     function init(){
     	//初始化父容器的长度
     	$("#showPirates").css("width",(pirateNameList.length+1)*100+"px");
     	//第一列为船长
     	$("#showPirates").append("<div id='pirate1'>"+captain[0]+"</div>");
     	setPirateCss($("#pirate1"));
     	addDelete($("#pirate1"));
     	addDetails(1);
     	//后面为其他船员
     	for(var i=2;i<pirateNameList.length+2;i++){
     		$("#showPirates").append("<div id='pirate"+i+"'>"+pirateNameList[i-2]+"</div>");
     	    setPirateCss($("#pirate"+i)); 
     	    addDelete($("#pirate"+i));
     	    addDetails(i);
     	}
     	
     	//锚点
//     	$("#showPirates").append("<div id='anchor'><a href='modifyGroup?groupName=test#pirate20'>10</a></div>");
//	    $("#anchor").css({
//	      "position":"fixed",
//	      "width":"50px",
//	      "height":"50px",
//	      "margin-left":"0",
//	      "margin-top":"100px",
//	      "z-index":"100",
//	      "background-color":"#333333"
//	    });
//     	
     }
     
	    //监听鼠标滚轮事件
		function addMouseSCrollEvent() {
        var oDiv = $('body')[0];
  
        function onMouseWheel(ev) {/*当鼠标滚轮事件发生时，执行一些操作*/
            var ev = ev || window.event;
            var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
            down = ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
            if(isUploadOpen===false){
	            //如果为展开状态则先关闭
	            if(isOpen===true&&onScroll===false){
	            	 onScroll = true;
	            	 //信息栏恢复原来的位置
	            	 $("#description"+openElement).children().each(function(i){
		        		$(this).css({
		        			"display":"none",
		        		  "opacity":"0",
		        		  "width":"0"
		        		});
		        	})
		        	$("#picture"+openElement).animate({
		             "width":"0"
		          });
		          $("#description"+openElement).animate({
		             "width":"0"
		          });
			          $("#details"+openElement).animate({
			             "width":"-="+detailsWidth+"px"
			          });
				      $("#showPirates").animate({
				          "width":"-="+detailsWidth+"px"
				      },function(){
				      	isOpen = false;
				      	onScroll = false;
						 $("#pirate"+openElement).css({
				              "background-color":"#7ABDFF",
				              "opacity":"1",
				              "color":"black"
				          });
				        $("#delete"+openElement).css({
						          "display":"none"
				          });
				      });
	            }
	            var deltaWidth = $("#details"+openElement).css("width")||0;
	            if(deltaWidth!=0){
	              deltaWidth = Number(deltaWidth.split("p")[0]);
	            }
	            if(down){
	            	var containerWidth = Number($("#showPirates").css("width").split("p")[0]);
		    		window.scrollTo(left+width,0);
		    		if(left+width<containerWidth-1366){
		    		  left+=width;
		    		}
		    		else{
		    			left = containerWidth-1366;
		    		}
		    	}
		    	else{
		    		window.scrollTo(left-width,0);
		    		if(left-width>0){
		    		  left-=width;
		    		}
		    		else{
		    		  left=0;
		    		}
		    	}
	    	
        }
            if(ev.preventDefault){/*FF 和 Chrome*/
                ev.preventDefault();// 阻止默认事件
            }
            return false;
        }
        addEvent(oDiv,'mousewheel',onMouseWheel);
        addEvent(oDiv,'DOMMouseScroll',onMouseWheel);
     }
    function addEvent(obj,xEvent,fn) {
        if(obj.attachEvent){
            obj.attachEvent('on'+xEvent,fn);
        }else{
            obj.addEventListener(xEvent,fn,false);
        }
    }

     
     //鼠标滚轮控制水平滚动条移动
		var left = 0;
		var width = Number($("#pirate1").css("width").split("p")[0]);
		var isOpen = false;
		var openElement = 0;
		//展开页是否正在收起
		var onScroll = false;
		 //信息栏的宽度
	    var detailsWidth = 1266;
	    addMouseSCrollEvent();
	    
	    //详细信息栏
	    function addDetails(id){
	      $("#pirate"+id).after("<div id='details"+id+"'></div>");
		   margin_left = Number($("#pirate"+id).css("margin-left").split("p")[0]);
		   $("#details"+id).css({
		   	"float":"left",
		     "width":"0",
		     "height":"593px",
		     "text-align":"center",
		     "background-color":"white",
		     "z-index":"4"
		   });
		   $("#details"+id).append("<div id='picture"+id+"'></div>");
		   $("#picture"+id).css({
		   	"float":"left",
		     "width":"0",
		     "height":"593px",
		     "background-color":"#333333"
		   });
		   $("#details"+id).append("<div id='description"+id+"'></div>");
		   $("#description"+id).css({
		    "float":"left",
		    "width":"0",
		    "height":"593px",
		    "background-color":"white"
		   });
		   function setDescriptionCss(dom){
		      dom.css({
			    "float":"left",
			    "width":"0",
			    "height":"80px",
			    "opacity":"0",
			    "display":"none",
			    "text-align":"center",
			    "line-height":"80px",
			    "border":"solid 1px  white",
			    "background-color":"#78ABDF"
			   });
		   }
		   function setLabelCss(dom){
		   	 dom.css({
		   	   "float":"left",
		   	   "width":"80px",
		   	   "height":"80px",
		   	   "text-align":"center",
		   	   "line-height":"80px",
		   	   "color":"#333333",
		   	   "font-size":"20px"
		   	 });
		   }
		   function setTextCss(dom){
		      dom.css({
		        "position":"absolute",
		        "margin-left":"80px",
		        "width":"766px",
		        "height":"80px",
		        "z-index":"5"
		      
		      });
		   
		   }
		   var pirateName = "";
		   if(id!=1){
		          pirateName = pirateNameList[id-2];
		   }
		   else{
		          pirateName = captain[0];
		   }
		   $("#description"+id).append("<div  id='name"+id+"'>"+"<div id='name"+id+"text'>"+pirateName+"</div></div>");
		   setDescriptionCss($("#name"+id));
		   setTextCss($("#name"+id+"text"));
		   $("#name"+id).append("<div id='nameLabel"+id+"'>海贼名<div>")
		   setLabelCss($("#nameLabel"+id));
		   $.ajax({
		      type:"post",
		      url:"queryPirate",
		      data:{pirateName:pirateName},
		      success:function(data){
		      	//放置图片
		      	$("#picture"+id).append("<img id='img"+id+"' style='width:100%;height:100%' src='"+data.pirateImgSrc+"'  />");
		      	 //填充详细信息
		      	 $("#description"+id).append("<div class='description' id='groupName"+id+"'>"+"<div id='groupName"+id+"text'>"+data.groupName+"</div></div>");
                 setDescriptionCss($("#groupName"+id));
                 setTextCss($("#groupName"+id+"text"));
//                 $("#groupName"+id).trigger("click");
//                 console.log($("#groupName"+id).attr("id"));
		      	 $("#groupName"+id).append("<div id='groupNameLabel"+id+"'>海贼团<div>");
		         setLabelCss($("#groupNameLabel"+id));
		         
		      	 $("#description"+id).append("<div class='description' id='position"+id+"'>"+"<div id='position"+id+"text'>"+data.position+"</div></div>");
                 setDescriptionCss($("#position"+id));
                 setTextCss($("#position"+id+"text"));
		      	 $("#position"+id).append("<div id='positionLabel"+id+"'>职位<div>");
		         setLabelCss($("#positionLabel"+id));
		         
		      	 $("#description"+id).append("<div class='description' id='bounty"+id+"'>"+"<div id='bounty"+id+"text'>"+data.bounty+"</div></div>");
                 setDescriptionCss($("#bounty"+id));
                 setTextCss($("#bounty"+id+"text"));
                 $("#bounty"+id).append("<div id='bountyLabel"+id+"'>赏金<div>");
		         setLabelCss($("#bountyLabel"+id));
                 
		      	 $("#description"+id).append("<div  id='weapon"+id+"'>"+"<div id='weapon"+id+"text'>"+data.weapon+"</div></div>");
                 setDescriptionCss($("#weapon"+id));
                 setTextCss($("#weapon"+id+"text"));
                 $("#weapon"+id).append("<div id='weaponLabel"+id+"'>能力<div>");
		         setLabelCss($("#weaponLabel"+id));
                 
                 skills = data.skills;
			     skills = skills.join(",");
			     skills = skills.replace("[","");
			     skills = skills.replace("]","");
			     skills = skills.split("\"").join("");
		      	 $("#description"+id).append("<div class='description' id='skills"+id+"'>"+"<div id='skills"+id+"text'>"+skills+"</div></div>");
                 setDescriptionCss($("#skills"+id));
                 setTextCss($("#skills"+id+"text"));
                 $("#skills"+id).append("<div id='skillsLabel"+id+"'>技能<div>");
		         setLabelCss($("#skillsLabel"+id));
                 
		      	 $("#description"+id).append("<div class='description' id='story"+id+"'>"+"<div id='story"+id+"text'>"+data.story+"</div></div>");
                 $("#story"+id).css({
				    "float":"left",
				    "width":"0",
				    "height":"113px",
				    "opacity":"0",
				    "display":"none",
				    "text-align":"center",
			        "line-height":"113px",
				    "border":"solid 1px white",
				    "background-color":"#78ABDF"
				   });
				   setTextCss($("#story"+id+"text"));
				    $("#story"+id).append("<div id='storyLabel"+id+"'>故事<div>");
		           $("#storyLabel"+id).css({
				   	   "float":"left",
				   	   "width":"80px",
				   	   "height":"113px",
				   	   "text-align":"center",
				   	   "line-height":"113px",
				   	   "color":"#333333",
				   	   "font-size":"20px"
				   });
		      }
		   })
	    }
	    
	    //海贼点击事件
	      //记录当前展开的海贼
	      var localPirate = "";
	    $("#showPirates").on("click","div[id^='pirate']",function(){
	    	var that = this;
	    	localPirate = $(this).attr("id");
	        var id = Number($.trim($(this).attr("id").split("e")[1]));
	        var deltaWidth = $("#details"+openElement).css("width")||0;
	         if(deltaWidth!=0){
              deltaWidth = Number(deltaWidth.split("p")[0]);
            }
	       
	       
	        //如果为展开状态，则关闭上一次展开的元素
	        if(isOpen===true){
	        	$("#description"+id).children().each(function(i){
	        		$(this).css({
	        			"display":"none",
	        		  "opacity":"0",
	        		  "width":"0"
	        		});
	        	})
	          $("#picture"+openElement).animate({
	             "width":"0"
	          });
	          $("#description"+openElement).animate({
	             "width":"0"
	          });
	          $("#details"+openElement).animate({
	             "width":"-="+detailsWidth+"px"
	          });
		      $("#showPirates").animate({
		          "width":"-="+detailsWidth+"px"
		      },function(){
		      	isOpen = false;
		      	 $("#pirate"+openElement).css({
			              "background-color":"#7ABDFF",
			              "opacity":"1",
			              "color":"black"
			          });
		      	 $("#delete"+openElement).css({
					          "display":"none"
			     });
		      	
		      	//等关闭动画结束在开始展开动画
		      	    $("#picture"+id).animate({
		             "width":"500px"
		          });
		          $("#description"+id).animate({
		             "width":"766px"
		          });
		      	    $("#details"+id).animate({
		               "width":"+="+detailsWidth+"px"
			        });
			        $("#showPirates").animate({
			            "width":"+="+detailsWidth+"px"
			        },function(){
			        	isOpen=true;
			        	openElement=id;
							        	
							        	//让被点击的元素尽可能处于屏幕中央
				              //当前已滑出屏幕左侧的元素个数
					        var leftElement = Math.floor(left/width);
					        //余数
					        var ramind = left%width;
					        //滚动条移动距离
					        var scroll = (id-leftElement-1)*width-ramind;
					        var containerWidth = Number($("#showPirates").css("width").split("p")[0]);
					          //让被点击元素成为最左侧的元素
					        if(left+scroll<0){
					          left = 0;
					        }
					        else if(left+scroll>containerWidth-1366){
					             left = containerWidth-1366;
					        }
					        else{
					          left = scroll+left;
					        }
					        window.scrollTo(left,0);
					        
					        //将被点击的海贼栏变透明
					        $(that).css({
					              "background-color":"#333333",
					              "opacity":"0.5",
					              "color":"white"
					          });
							$("#delete"+id).css({
					          "display":"block"
					       });       	
					         //展开页加载完成时，信息栏每行从右依次滑入动画
							$("#description"+id).children().each(function(i){
								$(this).css("width","766px");
								$(this).css("display","block");
								var that = this;
								setTimeout(function(){
									$(that).animate({
										"opacity":"1"
									});
								},i*100);
							});
			        });
		      });
	        }
	        else{
	        	
			    //展开    	
	        	$("#picture"+id).animate({
	             "width":"500px"
	          });
	          $("#description"+id).animate({
	             "width":"766px"
	          });
	        	 $("#details"+id).animate({
	               "width":"+="+detailsWidth+"px"
		        });
		        $("#showPirates").animate({
		            "width":"+="+detailsWidth+"px"
		        },function(){
		           isOpen=true;
		           openElement=id;
		           
			           //让被点击的元素尽可能处于屏幕中央
				              //当前已滑出屏幕左侧的元素个数
					        var leftElement = Math.floor(left/width);
					        //余数
					        var ramind = left%width;
					        //滚动条移动距离
					        var scroll = (id-leftElement-1)*width-ramind;
					        var containerWidth = Number($("#showPirates").css("width").split("p")[0]);
					          //让被点击元素成为最左侧的元素
					        if(left+scroll<0){
					          left = 0;
					        }
					        else if(left+scroll>containerWidth-1366){
					             left = containerWidth-1366;
					        }
					        else{
					          left = scroll+left;
					        }
					        window.scrollTo(left,0);
					        
					        //被点击海贼栏变透明
					        $(that).css({
					              "background-color":"#333333",
					              "opacity":"0.5",
					              "color":"white"
					          });
					       $("#delete"+id).css({
					          "display":"block"
					       });
					        
					        //展开页加载完成时，信息栏每行从右依次滑入动画
							$("#description"+id).children().each(function(i){
								$(this).css("width","766px");
								$(this).css("display","block");
								var that = this;
								setTimeout(function(){
									$(that).animate({
										"opacity":"1"
									});
								},i*100);
								
								
	/*							$(this).on("click",function(){
		        $(this).append("<div style='position:absolute' ><input id='"+id+"Input' type='text' placeholder='请输入以更改'></div>");
		        $("#"+id+"Input").css({
		           "border":"0",
		           "outline":"0"
		        });
	    });*/
								
							});

		        });
	        }
	    });

	    //信息的修改与保存事件
	      //记录上次点击的元素
	    var localModify = "";
	    $("div[id^='description']").on("click","div[id$='text']",function(){
	    	var id = $(this).attr("id");
	    	var attrId = "";
	    	for(var i=0;i<id.length;i++){
	    		if(!isNaN(id[i])){
	    			attrId = id.split(id[i])[0];
	    			break;
	    		}
	    	}
	    	if(attrId!="name"&&attrId!="weapon"){
	    		if(null!=localModify&&localModify!="")
			    	$("#"+localModify).css("display","none");
			    	
			    	//当前被点击的元素隐藏，显示输入框
			    	$(this).css("display","none");
			    	//之前元素的父元素的id
			    	if(null!=localModify&&localModify!=""){
				    	var id1 = localModify.split("Input")[0];
				    	//上一次被点击的元素显示
				    	$("#"+id1).css("display","block");
			    	
			    	//将上次点击的元素修改发送至后台进行数据更新，并实时更新前端显示
			    	var text = $("#"+localModify).val();
			    	if(text!=$("#"+id1).text()&&text!=""&&text!=null){
					    	//需要更改的属性名称
					    	var name = "";
					    	for(var i=0;i<localModify.length;i++){
					    	    if(!isNaN(localModify[i])){
					    	        name = localModify.split(localModify[i])[0];
					    	        break;
					    	    }
					    	}
					    	$.ajax({
					    	  url:"modifyPirate",
					    	  type:"post",
					    	  data:{String1:name,String2:text,pirateName1:$("#"+localPirate).text()},
					    	  success:function(){
					    	  	if(name==="groupName"){
					    	  	   url = location.href;
					    	  	   location.href = url.split("/")[4];
					    	  	}
					    	  	$("#"+id1).text(text);
					    	  	$("#"+id1+"Input").css("display","none");
					    	  }
					    	});
			        	}
			    	}
			    	if($("#"+id+"Input").length==0){
			            var id2 = id.split("text")[0];
			    		localModify = id+"Input";
			    		var str = id.split("y")[0]
			    		if(str==="stor"){
			    		    $("#"+id2).append("<div style='position:absolute;margin-top:0;height:78px;width:200px;overflow:hidden;margin-left:400px;text-align:center' ><input id='"+id+"Input' type='text' placeholder='请输入以更改'></div>");
			    		}
			    		else{
					        $("#"+id2).append("<div style='position:absolute;margin-top:0;height:78px;width:200px;overflow:hidden;margin-left:400px;text-align:center' ><input id='"+id+"Input' type='text' placeholder='请输入以更改'></div>");
			    		}
				        
				        $("#"+id+"Input").css({
				        	"background-color":"#78ABDF",
				           "border":"0",
				           "outline":"0",
				           "z-index":"4"
				        });
				        $("#"+id+"Input").focus();
			       }
			       else{
			           $("#"+id+"Input").css("display","block");
			           $("#"+id+"Input").focus();
			           $(this).css("display","none");
			           localModify = id+"Input";
			       }
	    	}
	    });
	    //海贼hover事件
	    $("#showPirates").on("mouseenter","div[id^='pirate']",function(){
	    	if(isOpen===false){
		          $(this).css({
		              "background-color":"#333333",
		              "opacity":"0.5",
		              "color":"white"
		          });
	    	}
	    });
	    $("#showPirates").on("mouseout","div[id^='pirate']",function(){
	    	if(isOpen===false){
	          $(this).css({
	              "background-color":"#7ABDFF",
	              "opacity":"1",
	              "color":"black"
	          });
	    	}
	    });
	    
	    //如果正在上传文件则锁定
	    var isUploadOpen = false;
	    //图片点击触发上传事件
	    $("div[id^='picture']").on("click","img[id^='img']",function(){
	    	  isUploadOpen = true;
	          //显示上传弹出层
	    	  var str = "<div id='upload'>"+
	    	                      "<div id='uploadClose'><span class='glyphicon glyphicon-remove' aria-hidden='true'>"+
	    	                      "</span></div>"+
					               "<div id='form'>"+
						                  "<form id='uploadForm' action='modifyPirate' enctype='multipart/form-data' method='post'>"+
						                      "<input type='file' id='pirateImg'  name='pirateImg' multiple='multiple'>"+
						                      "<button id='submit'>提交</button>"+
						                  "</form>"+
					               "</div>"+
					               "<div id='mask'>"+
					               "</div>"+
					        "</div>";
	    	  $("#details"+openElement).append(str);
              
	    	  
	    	  $("#submit").click(function(){
	    	  	   $(this).attr("disabled","disabled")
	    	       var pirateName1 = $("#pirate"+openElement).text();
	    	       var formData = new FormData();
	    	       formData.append("pirateName1",pirateName1);
	    	       formData.append("String1","pirateImg");
	    	       formData.append("pirateImg",$("#pirateImg")[0].files[0]);
	    	       console.log(formData.get("String1"));
	    	       $.ajax({
	    	           url:"updatePirateImg",
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
				 	   	    $("#img"+openElement).attr("src",data.pirateImgSrc);
				 	   	    $("#upload").remove();
				 	   	    isUploadOpen = false;
				 	   }
	    	       });
	    	  });
	    	  $("#uploadClose").click(function(){
	    	    $("#upload").remove();
	    	    isUploadOpen = false;
	    	  });
	    });
	    
	    //删除按钮点击事件
	    $("div[id^='pirate']").on("click","div[id^='delete']",function(){
	          var id = Number($(this).attr("id").split("e")[3]);
	          var pirateName = $("#pirate"+id).text();
	          if(confirm("确定要删除吗？")){
	             $.ajax({
	                 url:"deletePirate",
	                 type:"post",
	                 data:{pirateName:pirateName},
	                 success:function(data){
	                 	url = location.href;
					    location.href = url.split("/")[4];
	                 }
	             });
	          }
	    });
	    
});