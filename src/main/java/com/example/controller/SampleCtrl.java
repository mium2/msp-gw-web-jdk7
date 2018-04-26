package com.example.controller;

import kr.msp.base.util.JsonObjectConverter;
import kr.msp.constant.Const;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: mium2
 * Date: 14. 3. 18
 * Time: 오후 6:31
 * 서버 클라이언트 연동 Map<String,Object>을 이용한 샘플
 */
@Controller
public class SampleCtrl {
    private  Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired(required=true)
    @Qualifier("sqlSession_sample")  ///WEB-INF/config/context/sample-mybatis-context.xml파일에서 설정한 DB 연결세션
    private SqlSessionTemplate sqlSession;

    @Qualifier("messageSource")
    @Autowired(required=true)
    private MessageSource messageSource;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !!!주의 확인: RequestMapping  uri 는 반드시 /api로 시작 해야만 한다.
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping(method= RequestMethod.POST, value="/api/basic/sample/{id}",produces = "application/json; charset=utf8")
    public @ResponseBody String sampleList(HttpServletRequest request, HttpServletResponse response){

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


        //이 주석 부분은 클라이언트에서 받은 데이터를 확인 하는 용도로 사용
        //샘플 확인. URI Path VARIABLES ATTRIBUTE  {id} 갑 구하기
        logger.info("{id} value :"+ uriPathVal.get("id"));

        //샘플 확인.  클라이언트에서 넘어온 공통 헤더 맵정보 출력
        Set<Map.Entry<String,Object>> HeadMapSet = reqHeadMap.entrySet();
        logger.info("#############################################################");
        logger.info("################## 클라이언트가 보낸 헤더정보 ###############");
        logger.info("#############################################################");
        for(Map.Entry<String,Object> me : HeadMapSet){
            logger.info("# Key:"+me.getKey() + ", Value : " + me.getValue());
        }


        //샘플 확인 JSON 데이타로 출력해보기
        JSONObject headMapJson = new JSONObject(reqHeadMap);
        logger.info("#############################################################");
        logger.info("############### 클라이언트가 보낸 헤더 JSON변환 #############");
        logger.info("#############################################################");
        logger.info("# Head Json DATA:"+headMapJson);


        //샘플 확인.  클라이언트에서 넘어온 파라미터  맵정보 출력
        Set<Map.Entry<String,Object>> BodyMapSet = reqBodyMap.entrySet();
        logger.info("#############################################################");
        logger.info("############## 클라이언트가 보낸 파라미터 정보 ##############");
        logger.info("#############################################################");
        for(Map.Entry<String,Object> me : BodyMapSet){
            logger.info("# Key:"+me.getKey() + ", Value : " + me.getValue());
        }


        //샘플 확인 JSON 데이타로 출력해보기
        JSONObject bodyMapJson = new JSONObject(reqBodyMap);
        logger.info("#############################################################");
        logger.info("############ 클라이언트가 보낸 파라미터 JSON변환   ##########");
        logger.info("#############################################################");
        logger.info("# Parameters Json DATA:"+bodyMapJson);
        logger.info("#############################################################");
        try{
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/

            List<Map<String,Object>> userList = sqlSession.selectList("Sample.getSampleData",reqMap);
            responseBodyMap.put("userList", userList);


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
        responseMap.put(Const.BODY,responseBodyMap);

        return JsonObjectConverter.getJSONFromObject(responseMap);

    }

}
