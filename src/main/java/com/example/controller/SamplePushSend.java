package com.example.controller;

import kr.msp.base.util.httppoolclient.HttpPoolClient;
import kr.msp.base.util.httppoolclient.ResponseBean;
import kr.msp.constant.Const;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MIME;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.HttpClientBuilder;
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
            Map<String, String> httpHeadParam = new HashMap<String, String>();
            Map<String, Object> postParam = new HashMap<String, Object>();

            HttpClient client = HttpClientBuilder.create().build();
            HttpPost postMethod = new HttpPost("http://211.241.199.139:8080/upmc/rcv_register_message.ctl");

            try {
                // 헤더 셋팅
                httpHeadParam.put("Content-Type", "application/x-www-form-urlencoded");

                // 푸시 발송 파라미터 셋팅
                postParam.put("TYPE", "E");
                postParam.put("CUID", "MIUM001");   // 한명 보낼 경우
                //postParam.put("CUID", "[\"testuser1\",\"testuser2\",\"testuser3\"]");  //여러명 보낼 경우
                postParam.put("MESSAGE", "{\"title\":\"안녕하세요.유라클 공지사항입니다.\",\"body\":\"오늘 새벽에 정기점검 있습니다.\n 감사합니다.\"}");
                //postParam.put("MESSAGE", "안녕하세요. 테스트 발송입니다.");
                postParam.put("TEMPLATE_YN", "N");  //보내는 메세지의 치환변수(%CUID% or %CNAME%)가 있을 경우 Y로 보냄.
                postParam.put("PRIORITY", "3");
                postParam.put("BADGENO", "0");
                postParam.put("RESERVEDATE", "");  //예약발송일 경우 ex)20180708 153000
                postParam.put("SERVICECODE", "ALL");   // 발송 서비스코드 ALL, ALL2, PUBLIC, PRIVATE 중 택일
                postParam.put("EXT", "");
                postParam.put("SENDERCODE", "admin");
                postParam.put("APP_ID", "com.mium2.push.democlient");
                postParam.put("DB_IN", "Y");
                postParam.put("SPLIT_MSG_CNT", "0");
                postParam.put("DELAY_SECOND", "0");
                postParam.put("PUSH_FAIL_SMS_SEND", "N");

                ResponseBean responseBean = HttpPoolClient.getInstance().sendPost("http://211.241.199.139:8080/upmc/rcv_register_message.ctl", httpHeadParam, postParam);

                if (responseBean.getStatusCode() == 200) {
                    // 성공 비즈니스 로직 처리
                    logger.info(" 응답 스트링 : {}", responseBean.getBody());
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
            reqHeadMap.put(Const.RESULT_CODE, Const.EXCEPTION_ERROR);
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
    // PUSH CSV 발송 예제
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
            Map<String, String> httpHeadParam = new HashMap<String, String>();

            // 보낼 파라미터 정보 셋
            Map<String, Object> reqParam = new HashMap<String, Object>();
            reqParam.put("TYPE", "C");
            reqParam.put("MESSAGE", "{\"title\":\"안녕하세요.유라클 공지사항입니다.\",\"body\":\"오늘 새벽에 정기점검 있습니다.\n 감사합니다.\"}");
            //reqParam.put("MESSAGE", "안녕하세요. 테스트 발송입니다.");
            reqParam.put("TEMPLATE_YN", "N");  //보내는 메세지의 치환변수(%CUID% or %CNAME% or %VAR%)가 있을 경우 Y로 보냄.
            reqParam.put("PRIORITY", "3");
            reqParam.put("BADGENO", "0");
            reqParam.put("RESERVEDATE", "");  //예약발송일 경우 ex)20180708 153000
            reqParam.put("SERVICECODE", "ALL");   // 발송 서비스코드 ALL, ALL2, PUBLIC, PRIVATE 중 택일
            reqParam.put("EXT", "");
            reqParam.put("SENDERCODE", "admin");
            reqParam.put("APP_ID", "com.mium2.push.democlient");
            reqParam.put("DB_IN", "Y");
            reqParam.put("SPLIT_MSG_CNT", "0");
            reqParam.put("DELAY_SECOND", "0");
            reqParam.put("PUSH_FAIL_SMS_SEND", "N");

            // CSV로 보낼 푸시발송 유저 첨부파일 full 경로를 이용 CSV파일 보내정보 셋팅
            File csvFile = new File("/Users/mium2/temp/csv_test_send.csv");
            Map<String, File> fileParam = new HashMap<String, File>();
            fileParam.put("upload_file",csvFile);

            ResponseBean responseBean = HttpPoolClient.getInstance().sendMultipartPost("http://211.241.199.139:8080/upmc/rcv_register_csvmessage.ctl", httpHeadParam, reqParam, fileParam);

            if (responseBean.getStatusCode() == 200) {
                // 성공 비즈니스 로직 처리
                logger.info(" 응답 스트링 : {}", responseBean.getBody());
            }else{
                // 실패 비즈니스 로직 처리
            }
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직 마침.
             *************************************************************************************************/
        } catch (Exception e) {
            reqHeadMap.put(Const.RESULT_CODE, Const.EXCEPTION_ERROR);
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
