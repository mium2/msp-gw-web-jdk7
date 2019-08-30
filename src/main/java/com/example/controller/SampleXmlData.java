package com.example.controller;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Y.B.H(mium2) on 18. 6. 28..
 */
@Controller
public class SampleXmlData {
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired(required=true)
    @Qualifier("sqlSession_sample")  ///WEB-INF/config/context/sample-mybatis-context.xml파일에서 설정한 DB 연결세션
    private SqlSessionTemplate sqlSession;

    @Qualifier("messageSource")
    @Autowired(required=true)
    private MessageSource messageSource;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !!!주의 확인: RequestMapping  uri 는 반드시 /api로 시작 해야만 한다.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(value="/xmlData",produces = "text/xml; charset=utf8")
    public @ResponseBody String sampleList(HttpServletRequest request, HttpServletResponse response){

        String returnString = "";
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        try{
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/
            StringBuilder sb = new StringBuilder("<formrec><trans><![CDATA[<?xml version=\"1.0\" encoding=\"UTF-8\"?>[\r][\n]");
            sb.append("<body><pre style=\"width:800;padding-left:20;word-wrap:break-word\"><b></b></pre></body>");
            returnString = sb.toString();
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직 마침.
             *************************************************************************************************/
        } catch (Exception e) {
            e.printStackTrace();
        }

        return returnString;

    }

}
