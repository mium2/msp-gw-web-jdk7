<!-- 
//Common Error Page by UncleJoe 
 -->
<%@ page contentType="text/html; charset=utf-8" isErrorPage="true"%><%

	response.setStatus(200);
	String errorCode = "500";
	if(request.getParameter("ERROR") != null){
    	errorCode = request.getParameter("ERROR");
	}
%>{"head":{"result_code": "200","result_msg": "Success"}, body:{"errorCode":"<%=errorCode%>","errorMsg":"Server Error!"}}


