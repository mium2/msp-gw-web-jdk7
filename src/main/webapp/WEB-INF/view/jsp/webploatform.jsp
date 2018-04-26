<%@ page import="kr.msp.webplatform.dto.HtmlContentDto" %>
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2014-05-13
  Time: 오전 9:17
  To change this template use File | Settings | File Templates.
--%>
<%
    HtmlContentDto htmlContentDto = (HtmlContentDto)request.getAttribute("htmlContentDto");
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%=htmlContentDto.getContent()%>

