package com.example.controller;

import kr.msp.constant.Const;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MIME;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.*;

/**
 * Created by Y.B.H(mium2) on 18. 7. 9..
 */
@Controller
public class SamplePushSend {
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());
    @Qualifier("messageSource")
    @Autowired(required=true)
    private MessageSource messageSource;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 푸시 일반발송 예제
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(method= RequestMethod.POST, value="/api/pushSend",produces = "application/json; charset=utf8")
    public @ResponseBody
    ModelAndView pushSend(HttpServletRequest request, HttpServletResponse response){
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
            HttpClient client = HttpClientBuilder.create().build();
            HttpPost postMethod = new HttpPost("http://211.241.199.139:8080/upmc/rcv_register_message.ctl");

            try {
                // 헤더 셋팅
                postMethod.setHeader("Content-Type", "application/x-www-form-urlencoded");

                // 푸시 발송 파라미터 셋팅
                List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
                urlParameters.add(new BasicNameValuePair("TYPE", "E"));
                urlParameters.add(new BasicNameValuePair("CUID", "MIUM001"));   // 한명 보낼 경우
                //urlParameters.add(new BasicNameValuePair("CUID", "[\"testuser1\",\"testuser2\",\"testuser3\"]"));  //여러명 보낼 경우
                urlParameters.add(new BasicNameValuePair("MESSAGE", "{\"title\":\"안녕하세요.유라클 공지사항입니다.\",\"body\":\"오늘 새벽에 정기점검 있습니다.\n 감사합니다.\"}"));
//                urlParameters.add(new BasicNameValuePair("MESSAGE", "안녕하세요. 테스트 발송입니다."));
                urlParameters.add(new BasicNameValuePair("PRIORITY", "3"));
                urlParameters.add(new BasicNameValuePair("BADGENO", "0"));
                urlParameters.add(new BasicNameValuePair("RESERVEDATE", ""));  //예약발송일 경우 ex)20180708 153000
                urlParameters.add(new BasicNameValuePair("SERVICECODE", "ALL"));   // 발송 서비스코드 ALL, ALL2, PUBLIC, PRIVATE 중 택일
                urlParameters.add(new BasicNameValuePair("EXT", ""));
                urlParameters.add(new BasicNameValuePair("SENDERCODE", "admin"));
                urlParameters.add(new BasicNameValuePair("APP_ID", "com.mium2.push.democlient"));
                urlParameters.add(new BasicNameValuePair("DB_IN", "Y"));
                urlParameters.add(new BasicNameValuePair("SPLIT_MSG_CNT", "Y"));
                urlParameters.add(new BasicNameValuePair("DELAY_SECOND", "Y"));
                urlParameters.add(new BasicNameValuePair("PUSH_FAIL_SMS_SEND", "N"));

                postMethod.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));

                HttpResponse upmcResponse = client.execute(postMethod);
                if (upmcResponse.getStatusLine().getStatusCode() == 200) {
                    // 성공 비즈니스 로직 처리
                    BufferedReader rd = new BufferedReader(new InputStreamReader(upmcResponse.getEntity().getContent()));
                    StringBuffer result = new StringBuffer();
                    String line = "";
                    while ((line = rd.readLine()) != null) {
                        result.append(line);
                    }
                    logger.info(" 응답 스트링 : {}", result.toString());
                }else{
                    // 실패 비즈니스 로직 처리
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

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

        ModelAndView mv = new ModelAndView("defaultJsonView");
        mv.addObject(Const.HEAD,reqHeadMap);
        mv.addObject(Const.BODY,responseBodyMap);
        return mv;

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CSV 발송 예제
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(method= RequestMethod.POST, value="/api/pushCsvSend",produces = "application/json; charset=utf8")
    public @ResponseBody
    ModelAndView pushCsvSend(HttpServletRequest request, HttpServletResponse response){

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

            HttpClient client = HttpClientBuilder.create().build();
            HttpPost method = new HttpPost("http://211.241.199.139:8080/upmc/rcv_register_csvmessage.ctl");

            try {
                // 푸시 발송 파라미터 셋팅
                MultipartEntityBuilder reqEntityBuilder = MultipartEntityBuilder.create();
                Charset chars = Charset.forName("UTF-8");
                reqEntityBuilder.setCharset(chars);
                // CSV로 보낼 푸시발송 유저 첨부파일 full 경로.
                FileBody csvFile = new FileBody(new File("/Users/mium2/temp/csv_test_send.csv"));
                reqEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
                reqEntityBuilder.addPart("upload_file", csvFile);
                reqEntityBuilder.addTextBody("TYPE", "C");
//                reqEntityBuilder.addTextBody("MESSAGE", "{\"title\":\"안녕하세요.유라클 공지사항입니다.\",\"body\":\"오늘 새벽에 정기점검 있습니다.\n감사합니다.\"}", ContentType.create("text/plain", MIME.UTF8_CHARSET));
                reqEntityBuilder.addTextBody("MESSAGE", "%VAR1%일 입니다.%VAR2% 입니다. 금액: %VAR3%", ContentType.create("text/plain", MIME.UTF8_CHARSET));
                reqEntityBuilder.addTextBody("PRIORITY", "3");
                reqEntityBuilder.addTextBody("BADGENO", "0");
                reqEntityBuilder.addTextBody("RESERVEDATE", "");  //예약발송일 경우 ex)20180708 153000
                reqEntityBuilder.addTextBody("SERVICECODE", "ALL");
                reqEntityBuilder.addTextBody("EXT", "");
                reqEntityBuilder.addTextBody("SENDERCODE", "admin");
                reqEntityBuilder.addTextBody("APP_ID", "com.mium2.push.democlient");
                reqEntityBuilder.addTextBody("DB_IN", "Y");
                reqEntityBuilder.addTextBody("SPLIT_MSG_CNT", "0");
                reqEntityBuilder.addTextBody("DELAY_SECOND", "0");
                reqEntityBuilder.addTextBody("PUSH_FAIL_SMS_SEND", "N");

                HttpEntity multiPartEntity = reqEntityBuilder.build();
                method.setEntity(multiPartEntity);

                HttpResponse upmcResponse = client.execute(method);
                if (upmcResponse.getStatusLine().getStatusCode() == 200) {
                    // 성공 비즈니스 로직 처리
                    BufferedReader rd = new BufferedReader(new InputStreamReader(upmcResponse.getEntity().getContent()));
                    StringBuffer result = new StringBuffer();
                    String line = "";
                    while ((line = rd.readLine()) != null) {
                        result.append(line);
                    }
                    logger.info(" 응답 스트링 : {}", result.toString());
                }else{
                    // 실패 비즈니스 로직 처리
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

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

        ModelAndView mv = new ModelAndView("defaultJsonView");
        mv.addObject(Const.HEAD,reqHeadMap);
        mv.addObject(Const.BODY,responseBodyMap);
        return mv;

    }
}
