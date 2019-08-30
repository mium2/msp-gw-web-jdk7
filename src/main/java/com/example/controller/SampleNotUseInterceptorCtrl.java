package com.example.controller;

import kr.msp.base.dto.MobileMap;
import kr.msp.base.util.MspProtocolUtil;
import kr.msp.constant.Const;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * 설명 : 해당 예제는 통계를 쌓지 않기를 원하거나 interceptceptor를 타기를 원하지 않는 API를 만들 때 사용
 * User: mium2(Yoo Byung Hee)
 * Date: 2015-06-15
 * Time: 오전 9:16
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class SampleNotUseInterceptorCtrl {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired(required = true)
    private MessageSource messageSource;

    @RequestMapping(value = "/notUseInterceptor",produces = "application/json; charset=utf8")
    public ModelAndView notUseInterceptor(HttpServletRequest request, HttpServletResponse response) throws Exception {

        // JSON 문자열을 Map or List Object 로 변환
        Map<String,Object> responseMap = new HashMap<String, Object>();
        try {
            Map<String,Object> respMspBody = new HashMap<String, Object>();
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/
            respMspBody.put("TestKey","this is sample");
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직 마침.
             *************************************************************************************************/
            Map<String, Object> jsonHeadMap = MspProtocolUtil.getMspProtocolHeadMap(request, null);
            jsonHeadMap.put(Const.RESULT_CODE,"200");
            jsonHeadMap.put(Const.RESULT_MESSAGE,"OK");
            responseMap.put(Const.HEAD,jsonHeadMap);
            responseMap.put(Const.BODY,respMspBody);
        } catch (Exception e) {
            logger.error(e.toString());
            responseMap.put(Const.RESULT_MESSAGE,Const.EXCEPTION_ERROR);
            if (e.getMessage() != null) {
                responseMap.put(Const.RESULT_MESSAGE,e.getMessage());
            } else {
                responseMap.put(Const.RESULT_MESSAGE, messageSource.getMessage("500.error", null, Locale.ENGLISH));
            }
        }
        ModelAndView modelAndView = new ModelAndView("defaultJsonView");
        return modelAndView;
    }
}
