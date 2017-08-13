<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'administration.jsp' starting page</title>
    
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
	<!-- 引入css文件 -->
	<link rel="stylesheet"  type="text/css"  href="${pageContext.request.contextPath }/css/adPage.css"/>
	<!--引入less -->
	<!-- <script src="http://cdn.bootcss.com/less.js/1.7.0/less.min.js"></script> -->
     <!--引入js文件  -->
     <script type="text/javascript" src="${pageContext.request.contextPath }/js/adPage.js"></script>

  </head>
  
  <body>
  <!--采用中线分屏  -->
    <!-- <a href="addGroupPage">addGroup</a><br>
    <a href="addPiratePage">addPirate</a> -->
    <div id="left">
       <div id="left-text-hai">海</div>
       <div id="left-text-zei">贼</div>
    </div>
    <div id="left-mask"></div>
    <div id="right">
       <div id="right-text-hai">海</div>
       <div id="right-text-zei">贼</div>
       <div id="right-text-tuan">团</div>
    </div>
    <div id="right-mask"></div>
    <div id="middle-left">O</div>
    <div id="middle-right">R</div>

  </body>
</html>
