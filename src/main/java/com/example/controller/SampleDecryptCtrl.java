package com.example.controller;

import kr.msp.constant.Const;
import kr.msp.resource.util.CryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
 * Created by Y.B.H(mium2) on 19. 5. 24..
 */
@Controller
public class SampleDecryptCtrl {

    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired(required = true)
    private CryptoUtil cryptoUtil;

    @Qualifier("messageSource")
    @Autowired(required=true)
    private MessageSource messageSource;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !!!주의 확인: RequestMapping  uri 는 반드시 /api로 시작 해야만 한다.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(method= RequestMethod.POST, value="/api/sampleEncript",produces = "application/json; charset=utf8")
    public ModelAndView sampleList(HttpServletRequest request, HttpServletResponse response){

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

            cryptoUtil.initial(reqHeadMap.get("appid").toString());
            String encryptString = cryptoUtil.encrypt("안녕하세요. Uracle 암호화 샘플입니다!");
            logger.info("#### 암호화 값:"+encryptString);

            String decryptString = cryptoUtil.decrypt(encryptString);
            logger.info("#### 복호화 값:"+decryptString);

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
