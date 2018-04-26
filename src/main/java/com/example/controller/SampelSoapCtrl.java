package com.example.controller;

import kr.msp.constant.Const;
import kr.msp.legacy.parser.SoapParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.soap.*;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Created by Y.B.H(mium2) on 17. 4. 11..
 *
 * 설명 : SOAP 서버가 WSDL을 제공해 줄 경우는 아래의 방법을 사용하지 않는다.
 * $JAVA_HOME/bin/wsimport -s ./ http://soap서버주소/wsdl경로?WSDL 이라고 치면 연결 및 사용 할 수 있는 Bean 파일들이 생기고 해당 파일을 이용하여 비즈니스 로직을 수행 하면된다.
 * */
@Controller
public class SampelSoapCtrl{
private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

@Autowired(required=true)
private MessageSource messageSource;

    @RequestMapping(value="/api/soapSample",produces = "application/json; charset=utf8")
    public ModelAndView sampleUseConfig(HttpServletRequest request, HttpServletResponse response){
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
        try{
            /**************************************************************************************************
             * 이 부분에 비즈니스 로직을 코딩한다.
             * 만약, 클라이언트에 에러처리를 하고 싶다면  responseMap.setResultCode(Const.EXCEPTION_ERROR); 사용
             **************************************************************************************************/
            // Create SOAP Connection
            SOAPConnectionFactory soapConnectionFactory = SOAPConnectionFactory.newInstance();
            SOAPConnection soapConnection = soapConnectionFactory.createConnection();

            // Send SOAP Message to SOAP Server
            String url = "http://xxx.xxx.xxx.xxx/soapSample.do";
            SOAPMessage soapResponse = soapConnection.call(createSOAPRequest(), url);

            // print SOAP Response
            System.out.print("Response SOAP Message:");
            soapResponse.writeTo(System.out);

            soapConnection.close();
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
        ModelAndView mv = new ModelAndView("defaultJsonView");
        mv.addAllObjects(responseMap);
        return mv;
    }

    private SOAPMessage createSOAPRequest() throws Exception {
        MessageFactory messageFactory = MessageFactory.newInstance();
        SOAPMessage soapMessage = messageFactory.createMessage();
        SOAPPart soapPart = soapMessage.getSOAPPart();

        String serverURI = "http://xxx.xxx.xxx.xxx/";

        // SOAP Envelope
        SOAPEnvelope envelope = soapPart.getEnvelope();
        envelope.addNamespaceDeclaration("example", serverURI);

        /*
        // 인증 연결시 예제
        Constructed SOAP Request Message:
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:example="http://xxx.xxx.xxx.xxx/">
            <SOAP-ENV:Header/>
            <SOAP-ENV:Body>
                <example:VerifyEmail>
                    <example:email>mutantninja@gmail.com</example:email>
                    <example:LicenseKey>123</example:LicenseKey>
                </example:VerifyEmail>
            </SOAP-ENV:Body>
        </SOAP-ENV:Envelope>
         */

        // SOAP Body
        SOAPBody soapBody = envelope.getBody();
        SoapParser soapParser = new SoapParser(null);
        // SOAP Body 정보 가져오기 예제
        SOAPElement soapBodyElem = soapBody.addChildElement("VerifyEmail", "example");
        SOAPElement soapBodyElem1 = soapBodyElem.addChildElement("email", "example");
        soapBodyElem1.addTextNode("test@gmail.com");
        SOAPElement soapBodyElem2 = soapBodyElem.addChildElement("LicenseKey", "example");
        soapBodyElem2.addTextNode("123");

        MimeHeaders headers = soapMessage.getMimeHeaders();
        headers.addHeader("SOAPAction", serverURI + "VerifyEmail");

        soapMessage.saveChanges();

        /* Print the request message */
        System.out.print("Request SOAP Message:");
        soapMessage.writeTo(System.out);
        System.out.println();

        return soapMessage;
    }

}
