package com.example.controller;

import kr.msp.base.security.SecureAuth;
import kr.msp.constant.Const;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;

//import xecure.servlet.XecureConfig;
//import xecure.servlet.XecureServlet;

/**
 * Created with IntelliJ IDEA.
 * User: Yoo Byung Hee
 * Date: 14. 10. 12
 * Time: 오전 5:10
 * #3part 제품 암복호화를 사용 할때 예제 반드시 SecureAuth 인터페이스를 implements해서 사용한다..
 */
@Controller
public class SampleOtherSecureAuth implements SecureAuth{
    public Map<String, Object> requestHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {

        System.out.println("##############3party 제품 암호화");
        //////////////////////////////////////////////////////////////////////////
        //////////////////////////암호화 관련 로직////////////////////////////////
        String encyn = StringUtils.defaultString(request.getHeader(Const.USER_DATA_ENCRYPT), "n");
        System.out.println("클라이언트 암호화 처리 여부: "+encyn);

        String plaintext = "";
        if (StringUtils.equals(encyn, "y")) {  //암호화 처리 요청일 경우  복호화처리
            //해당 라이브러리(XecureServlet) 복호화를 처리를 request를 넘기면 처리 후 request를 반환 하므로 마지막인자 ciphertext null을 넘김
            plaintext = decrypt(request, response, null);
        }else{       //일반 평문 요청일 경우
            plaintext = readRequest(request);
        }
        //3. JSON > Map 으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(plaintext, new TypeReference<Map<String, Object>>(){});
    }

    public String responseHandle(HttpServletRequest request, HttpServletResponse response, Map<String, Object> responseMap) throws Exception {
        if (MapUtils.isEmpty(responseMap)) {
            return null;
        }

        response.setContentType("text/html; charset=utf-8");
        response.setHeader(Const.USER_APP_ID, StringUtils.defaultString(request.getHeader(Const.USER_APP_ID)));
        response.setHeader(Const.USER_DATA_ENCRYPT, StringUtils.defaultString(request.getHeader(Const.USER_DATA_ENCRYPT)));
        response.setHeader(Const.USER_DATA_ENCRYPT_NAME, StringUtils.defaultString(request.getHeader(Const.USER_DATA_ENCRYPT_NAME)));

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String encyn = StringUtils.defaultString(request.getHeader(Const.USER_DATA_ENCRYPT),"n");
            if (StringUtils.equals(encyn, "y")) {    // Request Data를 decrypt 했다면 Response 할때 Encrypt해서 보냄
                String encBody = encrypt(request, response, objectMapper.writeValueAsString(responseMap));
                responseMap.clear();
                responseMap.put("encrypt",encBody);
            }
        } catch (Exception e) {
        	// 에러 발생 시 Exception 처리 필요.
            //e.printStackTrace();
        }
        return null;
    }

    /**
     * 암호화 처리
     * @param request
     * @param response
     * @param plaintext  암호화 처리할 문자 스트링
     * @return
     * @throws Exception
     */
    public String encrypt(HttpServletRequest request, HttpServletResponse response, String plaintext) throws Exception {
        String encryptData = plaintext;

        /*
        XecureConfig xconfig = new XecureConfig();
        XecureServlet xservlet= new XecureServlet(xconfig, request, response);

        encryptData = xservlet.encrypt(plaintext);
        */
        return encryptData;
    }

    /**
     * 복호화 처리.
     * @param request
     * @param response
     * @param ciphertext  복호화 할 문자 스트링
     * @return
     * @throws Exception
     */
    public String decrypt(HttpServletRequest request, HttpServletResponse response, String ciphertext) throws Exception {
        String decryptData = null;
/*
        XecureConfig xconfig = new XecureConfig();
        XecureServlet xservlet= new XecureServlet(xconfig, request, response);

        StringBuffer buff = new StringBuffer();
        String line = null;
        BufferedReader reader = null;
        try {
            reader = xservlet.request.getReader();
            while ( (line = reader.readLine() ) != null ) {
                buff.append(line);
            }
            decryptData = buff.toString();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if ( reader != null ){try{reader.close();}catch(Exception e){}}
        }
*/

        return decryptData;
    }

    private String readRequest(HttpServletRequest request) throws Exception {
        StringBuffer buff = new StringBuffer();
        String line = null;
        BufferedReader reader = null;
        String postData = "";
        try {
            reader = request.getReader();
            while ( (line = reader.readLine() ) != null ) {
                buff.append(line);
            }
            postData = buff.toString();

        } catch (Exception e) {
            // e.printStackTrace();
        } finally {
            if ( reader != null ){try{reader.close();}catch(Exception e){}}
        }
        return postData;
    }

}
