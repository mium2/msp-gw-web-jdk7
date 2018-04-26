<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2014-09-16
  Time: 오후 2:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String encUrl = "";
    String encName = "";
    String encPass = "";

    if(request.getAttribute("encURL")!=null){
        encUrl = request.getAttribute("encURL").toString();
    }
    if(request.getAttribute("encName")!=null){
        encName = request.getAttribute("encName").toString();
    }
    if(request.getAttribute("encPass")!=null){
        encPass = request.getAttribute("encPass").toString();
    }
%>
<html>
<head>
    <title>DBCP 암호화</title>
    <style>
        /*
	Grey Suits you Sir. Please host the images on your own server.
	written by Stuart Colville http://www.muffinresearch.co.uk
*/

        table.FormTable, table.FormTable td{
            border               : 1px solid #CCC;
            border-collapse      : collapse;
            font                 : "굴림", "Bitstream Vera Sans", Verdana, Helvetica, sans-serif;
        }

        table.FormTable thead th,
        table.FormTable tbody th{
            background            : #FFF;
            color                 : #666;
            padding               : 5px 10px;
            border-left           : 1px solid #CCC;
            height                  : 30px;
        }
        table.FormTable tbody th{
            background            : #fafafb;
            border-top            : 1px solid #CCC;
            text-align            : left;
            font-weight           : normal;
        }
        table.FormTable tbody tr td{
            padding               : 8px 10px;
            color                 : #666;
            height                  : 30px;
        }
        table.FormTable tbody tr:hover{
            background            : #FFF;
        }

        table.FormTable tbody tr:hover td{
            color                 : #454545;
        }
        table.FormTable tfoot td,
        table.FormTable tfoot th{
            border-left           : none;
            border-top            : 1px solid #CCC;
            padding               : 4px;
            background            : #FFF;
            color                 : #666;
        }
        table.FormTable caption{
            text-align            : left;
            font-size             : 120%;
            padding               : 10px 0;
            color                 : #666;
        }
        table.FormTable a:link{
            color                 : #666;
        }
        table.FormTable a:visited{
            color                 : #666;
        }
        table.FormTable a:hover{
            color                 : #003366;
            text-decoration       : none;
        }
        table.FormTable a:active{
            color                 : #003366;
        }
    </style>
    <script language="javascript">
        function chkForm(){
            var form = document.encodForm;
            if(form.dbcpUrl.value==""){
                alert('URL 값을 입력해 주세요');
                return false;
            }
            if(form.dbcpName.value==""){
                alert('NAME 값을 입력해 주세요');
                return false;
            }
            if(form.dbcpPasswd.value==""){
                alert('PASSWORD 값을 입력해 주세요');
                return false;
            }

            return true;
        }
    </script>
</head>
<body>
<form name="encodForm" method="post" action="<%=request.getContextPath()%>/dbcpEncode" onsubmit="return chkForm();">
    <table style="width: 80%" class="FormTable">
        <colgroup><!-- 6cell -->
            <col width="20%"/><col width="auto"/>
        </colgroup>
        <tbody>
        <tr>
            <td>URL</td>
            <td><input type="text" name="dbcpUrl" style="width: 300px" value=""></td>
        </tr>
        <tr>
            <td>NAME</td>
            <td><input type="text" name="dbcpName" value=""></td>
        </tr>
        <tr>
            <td>PASSWORD</td>
            <td><input type="text" name="dbcpPasswd" value=""></td>
        </tr>
        <tr>
            <td colspan="2">
                <input type="submit" name="submit" value="암호화">
            </td>
        </tr>
        </tbody>
    </table>
<br><br><br>
    <table style="width: 80%" class="FormTable" style="margin-top: 30px">
        <colgroup><!-- 6cell -->
            <col width="20%"/><col width="auto"/>
        </colgroup>
        <thead>
        <tr>
            <td colspan="2" style="height: 30px; background-color: #999999;"> 암호화 된 값</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>URL</td>
            <td><%=encUrl%></td>
        </tr>
        <tr>
            <td>NAME</td>
            <td><%=encName%></td>
        </tr>
        <tr>
            <td>PASSWORD</td>
            <td><%=encPass%></td>
        </tr>

        </tbody>
    </table>
</form>
</body>
</html>
