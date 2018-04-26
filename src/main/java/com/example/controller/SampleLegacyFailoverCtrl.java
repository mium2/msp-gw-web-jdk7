package com.example.controller;

import com.google.gson.Gson;
import kr.msp.base.util.JsonObjectConverter;
import kr.msp.base.util.TcpAliveConManager;
import kr.msp.base.util.httpclient.HttpClientUtil;
import kr.msp.base.util.httpclient.ResponseBean;
import kr.msp.constant.Const;
import org.apache.http.Header;
import org.apache.http.client.config.RequestConfig;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Created by Y.B.H(mium2) on 17. 8. 22..
 */
@Controller
public class SampleLegacyFailoverCtrl {
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired(required=true)
    @Qualifier("sqlSession_sample")  ///WEB-INF/config/context/sample-mybatis-context.xml파일에서 설정한 DB 연결세션
    private SqlSession sqlSession;

    @Autowired(required=true)
    private MessageSource messageSource;

    private Gson gson = new Gson();

    private static final String DEFAULT_CHARSET = "UTF-8";

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !!!주의 확인: RequestMapping  uri 는 반드시 /api로 시작 해야만 한다.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(method= RequestMethod.POST, value="/api/msp/sample/httpLegacyProxy",produces = "application/json; charset=utf8")
    public @ResponseBody
    String SampleLegacyFailover(HttpServletRequest request, HttpServletResponse response){

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 클라이언트에서 넘어온 request 값  map으로 리턴해줌 (반드시 포함)
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //rest로 넘어온 URI Path VARIABLES ATTRIBUTE 맵정보
        Map<String,Object> uriPathVal = (Map<String,Object>)request.getAttribute(Const.REST_URI_PATH_VAL);
        //클라이언트에서 넘어온 request(HEAD+BODY) 모든정보
        Map<String,Object> reqMap =  (Map<String,Object>)request.getAttribute(Const.HTTP_BODY);
        //클라이언트에서 넘어온 공통 헤더 맵정보
        Map<String,Object> reqHeadMap =  (Map<String,Object>)request.getAttribute(Const.HEAD);
        //클라이언트에서 넘긴 파라미터 맵정보
        Map<String,Object> reqBodyMap =  (Map<String,Object>)request.getAttribute(Const.BODY);
        //클라이언트에서 넘길 Response 맵 세팅
        Map<String,Object> responseMap = new HashMap<String, Object>();
        Map<String, Object> responseBodyMap= new HashMap<String, Object>();
        if(reqHeadMap==null){
            reqHeadMap = new HashMap<String, Object>();
        }
        reqHeadMap.put(Const.RESULT_CODE, Const.OK);
        reqHeadMap.put(Const.RESULT_MESSAGE, Const.SUCCESS);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        try{
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/
            // 정보 확인 : 현재 사용가능한 네거시 호스트 리스트 요청
            List<String> aliveHostList = TcpAliveConManager.getInstance().getAliveHostNameList();
            logger.info("## Alive host List : {}",gson.toJson(aliveHostList));
            // 정보 확인 : 설정에 잘 못 등록된 호스트 리스트 정보
            List<String> badHostNameList = TcpAliveConManager.getInstance().getBadHostNameList();
            logger.info("## bad hostname List : {}",gson.toJson(badHostNameList));

            //연결할 네거시 호스트 정보를 요청한다.
            String connectHost = TcpAliveConManager.getInstance().getConHostName();
            logger.info("## connect host name : {}",connectHost);
            /****************************************************************************************************************
             * 단말로 부터 넘어온 데이타 정보를 담은 httpclient 인스턴스를 생성한다.
             * @param request 단말로 부터 넘어온 SESSIONID를 구하기 위해 필요. 세션유지가 필요없으면 null 입력
             *****************************************************************************************************************/
            HttpClientUtil httpClientUtil = new HttpClientUtil(request);

//            http 연결 정보를 셋팅
            RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(5000)
                .setConnectTimeout(5000)
                .setConnectionRequestTimeout(60000)
                .build();

            String httpCalUrl = connectHost+ "/index.html";

            /****************************************************************************************************************
             * 1.외부API 웹서버 POST 방식연결
             * @param httpCalUrl 연결할 URL
             * @param reqBodyMap 넘길 파라미터 Map<String,Object>형태, Request 파라미터 정보를 보낸다.
             * @param requestConfig 연결 컨넥션 정보 셋팅
             *****************************************************************************************************************/
            httpClientUtil.httpPostConnect(httpCalUrl,reqBodyMap,requestConfig);


            /****************************************************************************************************************
             * 1.외부API 웹서버 요청/응답 : RAW데이타 JSON일경우
             *  @param response 세션유지를 위해 단말로 부터 받은 세션아이디를 넣어준다. 만약 세션이 필요 하지 않을 경우는 null 입력
             *****************************************************************************************************************/
//            Map<String,Object> httpServerReturnMap = httpClientUtil.sendForJsonResponse(response);
//            logger.info("### [EXTERNAL WEB API SERVER]:"+ new JSONObject(httpServerReturnMap).toString());

            /****************************************************************************************************************
             * 2.외부API 웹서버 요청/응답 : RAW데이타 해당 Body String Data 각각의 Protocal 형태의 맞게 파싱해서 사용
             * @param response 세션유지를 위해 단말로 부터 받은 세션아이디를 넣어준다. 만약 세션이 필요 하지 않을 경우는 null 입력
             *****************************************************************************************************************/
            ResponseBean responseBean = httpClientUtil.sendForBodyString(response);
            Header[] headers = responseBean.getHeaders(); //해더값 출력
            for (Header header : headers) {
                logger.info("### [EXTERNAL WEB API SERVER] Response Key : " + header.getName()  + " ,Value : " + header.getValue());
            }
            String bodyString = responseBean.getBody(); //바디스트링 출력
            logger.info("### [EXTERNAL WEB API SERVER] bodyString:"+bodyString);
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////

            //연결한 HTTP 서버로 부터 받은 데이타를 단말로 "BODY"라는 맵키에 받은 데이타 JSON현태로 전달
            responseMap.put(Const.BODY,responseBean.getBody());

            /**************************************************************************************************
             * 이 부분에 비즈니스 로직 마침.
             *************************************************************************************************/
        } catch (Exception e) {
            reqHeadMap.put(Const.RESULT_CODE,Const.EXCEPTION_ERROR);
            if(e.getMessage() != null){
                reqHeadMap.put(Const.RESULT_MESSAGE,e.getMessage());
            } else {
                reqHeadMap.put(Const.RESULT_MESSAGE,messageSource.getMessage("500.error", null , Locale.getDefault().ENGLISH ));
            }
        }
        responseMap.put(Const.HEAD,reqHeadMap);

        return JsonObjectConverter.getJSONFromObject(responseMap);
    }
}
