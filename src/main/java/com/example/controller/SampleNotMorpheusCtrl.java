package com.example.controller;

import com.google.gson.Gson;
import kr.msp.constant.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created by Y.B.H(mium2) on 18. 4. 26..
 */
@Controller
public class SampleNotMorpheusCtrl {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired(required = true)
    private MessageSource messageSource;

    private Gson gson = new Gson();

    @RequestMapping(value = "/notUseMorpheus",produces = "application/json; charset=utf8")
    public @ResponseBody
    String notUseMorpheus(HttpServletRequest request, HttpServletResponse response) throws Exception {

        // JSON 문자열을 Map or List Object 로 변환
        Set<Object> responseSet = new HashSet<Object>();
        Map<String,Object> respMspBody = new HashMap<String, Object>();
        Map<String, Object> resHeadMap = new HashMap<String, Object>();
        try {
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/
            respMspBody.put("TestKey","this is sample");
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직 마침.
             *************************************************************************************************/
            resHeadMap.put(Const.RESULT_CODE,"200");
            resHeadMap.put(Const.RESULT_MESSAGE, "OK");
        } catch (Exception e) {
            logger.error(e.toString());
            resHeadMap.put(Const.RESULT_CODE,"500");
            if (e.getMessage() != null) {
                resHeadMap.put(Const.RESULT_MESSAGE, e.getMessage());
            } else {
                resHeadMap.put(Const.RESULT_MESSAGE, messageSource.getMessage("500.error", null, Locale.ENGLISH));
            }
        }
        responseSet.add(resHeadMap);
        responseSet.add(respMspBody);
        return gson.toJson(responseSet);
    }
}
