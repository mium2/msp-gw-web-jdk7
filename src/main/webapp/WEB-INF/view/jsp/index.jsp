<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2014-05-16
  Time: 오후 6:12
  To change this template use File | Settings | File Templates.
--%>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>Web Platform</title>
    <script type="text/javascript">
        (function(window, undefined) {

            var __WEB_INTERFACE_DATA__ = '';
            try {
                __WEB_INTERFACE_DATA__ = {"orientation":"DEFAULT","animation":"DEFAULT","param":"{}","actionType":"NEW_SCR"};
            }
            catch(e) {

            };

            window.__WEB_ROOT__ = '/msp-gw';
            window.__WEB_INTERFACE_ROOT__ = 'real_res/1/res';
            <%
            // 확인: res는 심볼릭 링크를 명. 만약, 다른이름으로 별칭을 주었을 경우 해당 이름으로 변경
            String resourceRoot = "real_res";
            String resName = request.getAttribute("resName").toString();
//            System.out.println("request.getContextPath():"+request.getContextPath()+"  resName:"+resName);
            if(request.getParameter("mode")!=null){
                if(request.getParameter("mode").equals("0")){
                    resourceRoot = "dev_res";
                }
            }
            if(request.getParameter("appID")!=null){
                out.println("window.__WEB_ROOT__ = '"+request.getContextPath()+"'");
                out.println("window.__WEB_INTERFACE_ROOT__ = '/"+resourceRoot+"/"+request.getParameter("appID")+resName+"'");

            }
            %>
            window.__WEB_INTERFACE_DATA__ = __WEB_INTERFACE_DATA__;

        })(window);
    </script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/libs/jquery/jquery.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/libs/instance/instance.ui.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/resources/js/ui/web/platform/web.js"></script>
</head>
<body>

</body>
<script type="text/javascript">

    Web.instance.openStartPage();

</script>
</html>
