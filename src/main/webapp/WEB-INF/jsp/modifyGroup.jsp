<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'addGroup.jsp' starting page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
    <!--引入bootstrap样式表  -->
	<link rel="stylesheet"
		href="<%=basePath %>bootstrap/bootstrap.min.css">
	<!--引入jquery，需要放在bootstrap前面，因为bootstrap中部分功能需要jquery  -->
	<script type="text/javascript" src="<%=basePath %>jquery/jquery-3.0.0.js"></script>
	<!--引入bootstrap  -->
	<script type="text/javascript"
		src="<%=basePath %>bootstrap/bootstrap.min.js"></script>
		<!--引入js文件  -->
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/modifyGroup.js"></script>
	<!--引入md5  -->
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/md5.js"></script>
	
	<script type="text/javascript" src="https://cdn.bootcss.com/jquery-easing/1.4.1/jquery.easing.min.js"></script>
	<!-- 引入css文件 -->
	<link rel="stylesheet"  type="text/css"  href="${pageContext.request.contextPath }/css/modifyGroup.css"/>

  </head>
  
  <body>
     <div id="container">
    <div class="row" id="row1">
		<!-- 导航条所在行 -->
		<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
		<!-- Brand and toggle get grouped for better mobile display --> <!-- 可折叠导航条，对移动端更友好 -->
		<!--首页标识符  -->
		<div class="navbar-header">
			<button type="button"  id="PageButton" style="color:white;" class="navbar-toggle btn btn-default" data-toggle="collapse"
					data-target="#bs-example-navbar-collapse-1">
					<span class="glyphicon glyphicon-menu-hamburger" ></span>
					</button>
			<a class="navbar-brand" href="mainPage">新世界</a>
		</div>

		<!-- Collect the nav links, forms, and other content for toggling -->
		<div class="collapse navbar-collapse"
			id="bs-example-navbar-collapse-1">
			

			<div class="nav navbar-nav navbar-right">
				<span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span> <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
			</div>
            
            <!-- 下拉菜单 -->
            <input type="hidden" id="isLogin" value=${sessionScope.isLogin } />
			<ul class="nav navbar-nav navbar-right">
				<!-- <li id="logined"></a></li> -->
				<li class="dropdown"  id="loginIn"><a href="#" class="dropdown-toggle"
					data-toggle="dropdown">管理页面 <b class="caret"></b> </a>
					<ul class="dropdown-menu" style="text-align:center">
						<li><a id="login" href="#">请先登录</a>
						</li>
					</ul></li>
					<li class="dropdown" id="loginOut" ><a href="#" class="dropdown-toggle"
						data-toggle="dropdown">管理页面 <b class="caret"></b> </a>
						<ul class="dropdown-menu" style="text-align:center">
							<li><a href="adPage">新增</a>
							</li>
							<li class="divider"></li>
							<li><a href="show">查看</a>
							</li>
							<li class="divider"></li>
							<li><a href="loginOut">注销</a>
							</li>
						</ul></li>
				<li class="dropdown"><a href="#" class="dropdown-toggle"
					data-toggle="dropdown">势力分布 <b class="caret"></b> </a>
					<ul class="dropdown-menu" style="text-align:center">
						<li><a href="overview">势力总览</a>
						</li>
						<li class="divider"></li>
						<li><a href="showPirates">人物介绍</a>
						</li>
					</ul></li>
			</ul>
			<!--搜索框  -->
			<form class="navbar-form navbar-right" role="search"
				action="search">
				<div class="form-group">
					<input type="text" class="form-control"  name="search"   placeholder="Search" >
				</div>
				<button type="submit" class="btn btn-default">搜索</button>
			</form>
		</div>
		<!-- /.navbar-collapse --> </nav>
	</div>
    
           
         
    <div  id="showPirates">
            <input type="hidden" id="isLogin" value=${sessionScope.isLogin }> 
            <input type="hidden" id="pirates" value=${pirateName }> 
           <input type="hidden" id="position" value=${position }>
           <input type="hidden" id="captain" value=${captain }>
           

     </div>
   </div>
   
  </body>
</html>
