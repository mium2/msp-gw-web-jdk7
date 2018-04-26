package com.example.controller;

import com.sap.conn.jco.*;
import kr.morpheus.adapter.sap.JcoDestionPoolManager;
import kr.morpheus.adapter.sap.SapFuncManager;
import kr.morpheus.adapter.sap.bean.JcoClientConnectBean;
import kr.morpheus.adapter.sap.bean.SAPFunctionParamInfoBean;
import kr.msp.base.util.JsonObjectConverter;
import kr.msp.constant.Const;
import org.json.JSONObject;
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
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: Yoo Byung Hee
 * Date: 14. 1. 15
 * Time: 오전 9:38api
 ################################################
 # SAP 서버와 연결할 수 있는 연결 설정
 ################################################
 설명 : SAP 설정파일과 서비스포트에 관련된 정보는 SAP으로 부터 가이드 받아야 한다.
 여기서는 sap과 연결가능한 포트 및 호스트를 셋팅하고 라이브러리를 등록한다.
 이유는 SAP 설치버전에 따라서 라이브러리 파일을 제공한다.

 ## Require File
 Windows 서버의 경우 sapjco3.jar 파일과 sapjco3.dll 파일을 Apache Tomcat의 lib 폴더에 저장.
 Linux 서버의 경우 sapjco3.jar 파일과 libsapjco3.so 파일을 Apache Tomcat의 lib 폴더에 저장.

 예) 윈도우 셋팅방법
 가). java 32bit ==> C:\Windows\SysWOW64\sapjco3.dll(32bit)을 넣는다
 나). services.txt 파일 안에 내용 복사해서 windows -> system32 -> driver -> etc services에 넣기
 */
@Controller
public class SampleSapCtrl {
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Qualifier("messageSource")
    @Autowired(required=true)
    private MessageSource messageSource;

    /**
     * SAP 조회 예제
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value="/api/adapter/sap/FuncSearch",produces = "application/json; charset=utf8")
    public @ResponseBody String FuncSearch(HttpServletRequest request, HttpServletResponse response){
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
        try {
            JcoClientConnectBean jcoClientConnectBean = new JcoClientConnectBean();
            jcoClientConnectBean.setLang("en");
            jcoClientConnectBean.setAshost("127.0.0.1");
            jcoClientConnectBean.setClient("800");
            jcoClientConnectBean.setUser("rfcuser01");
            jcoClientConnectBean.setPasswd("rfcuser01");
            jcoClientConnectBean.setSysnr("00");
            jcoClientConnectBean.setPool_capacity("10");
            jcoClientConnectBean.setPeak_limit("5");

            // 확인 : 호스트별로 컨넥션풀을 관리 하고 싶을 경우는 poolName를 jcoClientConnectBean.getAshost()로 사용하고
            // 같은호스트더라도 유저별로 컨넥션풀을 관리하고 싶다면 jcoClientConnectBean.getAshost()+"_"+jcoClientConnectBean.getUser()로 한다.
            String poolName = jcoClientConnectBean.getAshost()+"_"+jcoClientConnectBean.getUser();

            SapFuncManager sapFuncManager = new SapFuncManager(poolName,"RFC_FUNCTION_SEARCH",jcoClientConnectBean);

            // import parameter 조회
            List<SAPFunctionParamInfoBean> importParams = sapFuncManager.getAllImportParamsMetadatas();
            sapFuncManager.FunctionInfoPrint(importParams);
            //리턴되는 파라미터 조회
            List<SAPFunctionParamInfoBean> returnParams = sapFuncManager.getAllReturnParameMetadatas();
            sapFuncManager.FunctionInfoPrint(returnParams);
            // JCoFunction 구하기
            Map<String,Object> reqSapParamMap = new HashMap<String, Object>();  //Function에 전달할 파라미터맵
            reqMap.put("FUNCNAME","Z*");     // Z로 시작되는 펑션명
            reqMap.put("GROUPNAME","Z*");    // 펑션그룹이 Z로 시작되는 펑션
            reqMap.put("LANGUAGE","en");     // 언어 기본값 en
            JCoFunction jCoFunction = sapFuncManager.excuteJCoFunction(reqSapParamMap,poolName,jcoClientConnectBean);

            //리턴되는 값중 원하는 테이블 리스트 받기
            List<Map<String,Object>> revList = sapFuncManager.getTableRowsData(jCoFunction,"FUNCTIONS");

            responseBodyMap.put("data",revList);

        } catch (JCoException e) {
            reqHeadMap.put(Const.RESULT_CODE, Const.EXCEPTION_ERROR);
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

    /**
     * SAP Function 파라미터 정보 조회 예제
     */
    @RequestMapping(value="/api/adapter/sap/getCompanyCode",produces = "application/json; charset=utf8")
    public @ResponseBody String callBAPI_COMPANYCODE_GETDETAIL(HttpServletRequest request, HttpServletResponse response){
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
        try {
            JcoClientConnectBean jcoClientConnectBean = new JcoClientConnectBean();
            jcoClientConnectBean.setLang("en");
            jcoClientConnectBean.setAshost("127.0.0.1");
            jcoClientConnectBean.setClient("800");
            jcoClientConnectBean.setUser("rfcuser01");
            jcoClientConnectBean.setPasswd("rfcuser01");
            jcoClientConnectBean.setSysnr("00");
            jcoClientConnectBean.setPool_capacity("10");
            jcoClientConnectBean.setPeak_limit("5");

            // 확인 : 호스트별로 컨넥션풀을 관리 하고 싶을 경우는 poolName를 jcoClientConnectBean.getAshost()로 사용하고
            // 같은호스트더라도 유저별로 컨넥션풀을 관리하고 싶다면 jcoClientConnectBean.getAshost()+"_"+jcoClientConnectBean.getUser()로 한다.
            String poolName = jcoClientConnectBean.getAshost()+"_"+jcoClientConnectBean.getUser();

            SapFuncManager sapFuncManager = new SapFuncManager(poolName,"BAPI_COMPANYCODE_GETDETAIL",jcoClientConnectBean);

            // JCoFunction 구하기
            Map<String,Object> reqSapParamMap = new HashMap<String, Object>();  //Function에 전달할 파라미터맵
            reqMap.put("COMPANYCODEID", "0001");
            JCoFunction jCoFunction = sapFuncManager.excuteJCoFunction(reqSapParamMap,poolName,jcoClientConnectBean);

            //리턴되는 파라미터중 RETURN 데이타 가져오기
            Map<String,Object> returnResutlMap = sapFuncManager.getStructureMapData(jCoFunction, "RETURN");
            responseBodyMap.put("RETURN",returnResutlMap);
            logger.debug("########### 리턴파라미터 RETURN 값:" + new JSONObject(returnResutlMap));

            //리턴되는 파라미터중 RETURN 데이타 가져오기
            Map<String,Object> revCompanyDetailMap = sapFuncManager.getStructureMapData(jCoFunction,"COMPANYCODE_DETAIL");
            responseBodyMap.put("COMPANYCODE_DETAIL",revCompanyDetailMap);
            logger.debug("########### 리턴파라미터 COMPANYCODE_DETAIL 값:"+new JSONObject(revCompanyDetailMap));

        } catch (JCoException e) {
            reqHeadMap.put(Const.RESULT_CODE, Const.EXCEPTION_ERROR);
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

    /**
     * SAP insert 예제
     * @throws JCoException
     */
    @RequestMapping(value="/api/adapter/sap/insertCustomerData",produces = "application/json; charset=utf8")
    public @ResponseBody String insertCustomerData(HttpServletRequest request, HttpServletResponse response) {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 클라이언트에서 넘어온 request 값  map으로 리턴해줌 (반드시 포함)
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //rest로 넘어온 URI Path VARIABLES ATTRIBUTE 맵정보
        Map<String, Object> uriPathVal = (Map<String, Object>) request.getAttribute(Const.REST_URI_PATH_VAL);
        //클라이언트에서 넘어온 request(HEAD+BODY) 모든정보
        Map<String, Object> reqMap = (Map<String, Object>) request.getAttribute(Const.HTTP_BODY);
        //클라이언트에서 넘어온 공통 헤더 맵정보
        Map<String, Object> reqHeadMap = (Map<String, Object>) request.getAttribute(Const.HEAD);
        //클라이언트에서 넘긴 파라미터 맵정보
        Map<String, Object> reqBodyMap = (Map<String, Object>) request.getAttribute(Const.BODY);
        //클라이언트에서 넘길 Response 맵 세팅
        Map<String, Object> responseMap = new HashMap<String, Object>();
        Map<String, Object> responseBodyMap = new HashMap<String, Object>();
        if (reqHeadMap == null) {
            reqHeadMap = new HashMap<String, Object>();
        }
        reqHeadMap.put(Const.RESULT_CODE, Const.OK);
        reqHeadMap.put(Const.RESULT_MESSAGE, Const.SUCCESS);

        try {
            JcoClientConnectBean jcoClientConnectBean = new JcoClientConnectBean();
            jcoClientConnectBean.setLang("en");
            jcoClientConnectBean.setAshost("127.0.0.1");
            jcoClientConnectBean.setClient("800");
            jcoClientConnectBean.setUser("rfcuser01");
            jcoClientConnectBean.setPasswd("rfcuser01");
            jcoClientConnectBean.setSysnr("00");
            jcoClientConnectBean.setPool_capacity("10");
            jcoClientConnectBean.setPeak_limit("5");

            // 확인 : 호스트별로 컨넥션풀을 관리 하고 싶을 경우는 poolName를 jcoClientConnectBean.getAshost()로 사용하고
            // 같은호스트더라도 유저별로 컨넥션풀을 관리하고 싶다면 jcoClientConnectBean.getAshost()+"_"+jcoClientConnectBean.getUser()로 한다.
            String poolName = jcoClientConnectBean.getAshost() + "_" + jcoClientConnectBean.getUser();
            JCoDestination destination = JcoDestionPoolManager.getInstance().getJCoDestination(poolName, jcoClientConnectBean);
            JCoRepository repository = destination.getRepository();
            JCoContext.begin(destination);
            JCoFunction function = repository.getFunction("BAPI_CUSTOMER_CREATEFROMDATA1");

            if (function == null) {
                throw new RuntimeException("BAPI_CUSTOMER_CREATEFROMDATA1" + " not found in SAP.");
            }

            logger.debug("BAPI_CUSTOMER_CREATEFROMDATA1 Name from function object: " + function.getName());

            function.getImportParameterList().setValue("I_DLVY_DCMT_NO", "DL09092100311");
            // JCoStructure jCoStructure = function.getImportParameterList().getStructure("구조체이름");
            JCoTable put_jCoTable = function.getTableParameterList().getTable("O_ZMBS041");

            for (int i = 0; i < 10; i++) {
                put_jCoTable.appendRow();
                put_jCoTable.setValue("LASTNAME", "John Ray");
                put_jCoTable.setValue("FIRSTNAME", "John Ray");
                put_jCoTable.setValue("CITY", "Texsas Vd");
                put_jCoTable.setValue("LANGU_P", "EN");
                put_jCoTable.setValue("LANGUP_ISO", "EN");
                put_jCoTable.setValue("COUNTRY", "US");
                put_jCoTable.setValue("CURRENCY", "DOLLARS");
                put_jCoTable.setValue("POSTL_COD1", "103258");
                put_jCoTable.setValue("REF_CUSTMR", "000014523");
                put_jCoTable.setValue("SALESORG", "1250");
                put_jCoTable.setValue("DISTR_CHAN", "20");
                put_jCoTable.setValue("DIVISION", "20");
            }

            function.execute(destination);

            // 1. 결과 파라미터가 Structure일 경우
            JCoMetaData jCoMetaData = function.getExportParameterList().getMetaData();
            for (int i = 0; i < jCoMetaData.getFieldCount(); i++) {       // Function에서 전달된 구조체들을 BEAN에 담는다,
                String ResStructureName = jCoMetaData.getName(i);
                JCoStructure rev_codes = function.getExportParameterList().getStructure(ResStructureName);

                JCoRecordMetaData jCoRecordMetaData = rev_codes.getRecordMetaData();
                for (int k = 0; k < jCoRecordMetaData.getFieldCount(); k++) {      //받은 구조체의 컬럼명과 Value를 구해 HashMap에 담는다.
                    String FieldName = jCoRecordMetaData.getName(k);
                    String FieldValue = rev_codes.getString(FieldName);

                    logger.debug("결과  Key :" + FieldName + "   value : " + FieldValue);
                }
            }

            // 2. 결과 데이타 String일 경우
            // String cusnumber = function.getExportParameterList().getString("RESULTCODE");

            // 3. 결과 파라미터가 Table일 경우
            /*
            JCoParameterList jCoParameterList = function.getExportParameterList();
            if(jCoParameterList!=null){
                try{
                    JCoTable rev_jcoTable = jCoParameterList.getTable("응답받은 JCO테이블명");     //응답한 테이블 이름의 테이블을 가져온다.
                    JCoRecordMetaData jCoRecordMetaData = rev_jcoTable.getRecordMetaData();

                    for (int j = 0; j < rev_jcoTable.getNumRows(); j++){      //
                        rev_jcoTable.setRow(j);
                        for(int k=0; k<jCoRecordMetaData.getFieldCount(); k++){      //컬럼명 구하기
                            String FieldName = jCoRecordMetaData.getName(k);
                            String FieldValue = rev_jcoTable.getString(FieldName);
                        }
                    }
                }catch(Exception e){}
            }
            */

        } catch (JCoException e) {
            reqHeadMap.put(Const.RESULT_CODE, Const.EXCEPTION_ERROR);
            if (e.getMessage() != null) {
                reqHeadMap.put(Const.RESULT_MESSAGE, e.getMessage());
            } else {
                reqHeadMap.put(Const.RESULT_MESSAGE, messageSource.getMessage("500.error", null, Locale.getDefault().ENGLISH));
            }
        }
        responseMap.put(Const.HEAD, reqHeadMap);
        responseMap.put(Const.BODY, responseBodyMap);
        return JsonObjectConverter.getJSONFromObject(responseMap);
    }

}

