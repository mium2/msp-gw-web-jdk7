package com.example.controller;

import kr.msp.base.util.JsonObjectConverter;
import kr.msp.base.util.httpclient.HttpClientUtil;
import kr.msp.base.util.httpclient.ResponseBean;
import kr.msp.constant.Const;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.http.Header;
import org.apache.http.client.config.RequestConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.*;

/**
 * Created by Y.B.H(mium2) on 15. 9. 8..
 */
@Controller
public class SampleUploadProxyCtrl {

    @Autowired(required=true)
    private MessageSource messageSource;

    @Value("${upload.path:/tmp}")
    private String UPLOAD_ROOT_PATH;

    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @RequestMapping(value="/api/sample/proxy/fileUpload",method= RequestMethod.POST,produces = "application/json; charset=utf8")
    public @ResponseBody String mobileTempUploadPost(HttpServletRequest request, HttpServletResponse response){

        //클라이언트에서 넘어온 공통 헤더 맵정보
        Map<String,Object> reqHeadMap =  (Map<String,Object>)request.getAttribute(Const.HEAD);
        //클라이언트에서 넘긴 파라미터 맵정보
        Map<String,Object> reqBodyMap =  (Map<String,Object>)request.getAttribute(Const.BODY);
        //클라이언트에서 넘길 Response 맵 세팅
        Map<String,Object> responseMap = new HashMap<String, Object>();
        Map<String, Object> responseBodyMap= new HashMap<String, Object>();

        if(reqHeadMap==null){ //restclient를 이용하면 raw데이타가 없기 때문
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
            boolean isMultipart = ServletFileUpload.isMultipartContent(request);
            if(isMultipart){
                List<Map<String,File>> attachFileList = new ArrayList<Map<String, File>>();
                MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
                final Map<String,String[]> multiParamMap = multipartRequest.getParameterMap();
                final Map<String, MultipartFile> files = multipartRequest.getFileMap();
                Iterator<Map.Entry<String, MultipartFile>> itr = files.entrySet().iterator();
                MultipartFile file;
                String filePath = "";
                String uploadFileName = "";

                Map<String,Object> reqMultiParamMap = new HashMap<String, Object>();
                // 클라이언트에서 멀티파트리퀘스트로 넘긴 파라미터 확인
                Set<Map.Entry<String,String[]>> paramEntrySet = multiParamMap.entrySet();
                for(Map.Entry<String,String[]> paramEntry : paramEntrySet){
                    String[] value = paramEntry.getValue();
                    for(int i=0; i<value.length; i++){
                        reqMultiParamMap.put(paramEntry.getKey(), value[i]);
                    }
                    logger.debug("##### Param Key :"+paramEntry.getKey().toString()+     "    Value :"+paramEntry.getValue().toString());
                }
                // 멀티파트로 넘긴 첨부파일 확인
                while (itr.hasNext()) {
                    Map.Entry<String, MultipartFile> entry = itr.next();
                    logger.debug("[" + entry.getKey() + "]");
                    file = entry.getValue();

                    if (!"".equals(file.getOriginalFilename())) {
                        uploadFileName = file.getOriginalFilename();
                        String fileExtention = uploadFileName.substring(uploadFileName.lastIndexOf(".")+1,uploadFileName.length()).toLowerCase();
                        if(!fileExtention.equals("jpg") && !fileExtention.equals("gif") && !fileExtention.equals("png") && !fileExtention.equals("zip")){
                            throw new Exception("올바르지 않은 확장자 입니다");
                        }
                        //중요!. UPLOAD_ROOT_PATH 경로를 잘 설정해 주세요. /WEB-INF/classes/config/custom.xml의 upload.path 엘리먼트확인
                        filePath = UPLOAD_ROOT_PATH+File.separator+uploadFileName;
                        File attatchFile = new File(filePath);
                        file.transferTo(attatchFile);
                        Map<String,File> attachFileMap = new HashMap<String, File>();
                        attachFileMap.put(entry.getKey(), attatchFile);
                        attachFileList.add(attachFileMap);
                    }
                }

                //네거시 서버에 http Client를 이용 첨부파일 및 파라미터 호출
                // 파일 사이즈에 따라 컨넥션 타임아웃 시간을 늘려야 합니다.
                HttpClientUtil httpClientUtil = new HttpClientUtil(request);
                RequestConfig requestConfig = RequestConfig.custom()
                        .setSocketTimeout(60000)
                        .setConnectTimeout(60000)
                        .setConnectionRequestTimeout(60000)
                        .build();
                // 호출할 네거시 시스템 URI
                String httpCalUrl = "http://211.241.199.63:8085/msp-gw/api/sample/fileUpload";
                httpClientUtil.httpPostConnect(httpCalUrl,null,reqMultiParamMap,attachFileList,requestConfig);

                ResponseBean responseBean = httpClientUtil.sendForBodyString(response);
                Header[] headers = responseBean.getHeaders(); //해더값 출력
                for (Header header : headers) {
                    logger.info("### [EXTERNAL WEB API SERVER] Response Key : " + header.getName()  + " ,Value : " + header.getValue());
                }
                String bodyString = responseBean.getBody(); //바디스트링 출력
                logger.info("### [EXTERNAL WEB API SERVER] bodyString:"+bodyString);
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////

                //연결한 HTTP 서버로 부터 받은 데이타를 단말로 "BODY"라는 맵키에 받은 데이타 JSON현태로 전달
                responseBodyMap.put(Const.BODY, responseBean.getBody());

            }else{
                reqHeadMap.put(Const.RESULT_CODE,Const.EXCEPTION_ERROR);
                reqHeadMap.put(Const.RESULT_MESSAGE,"ENCTYPE이 multipart/form-data가 아닙니다.");
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


        responseMap.put(Const.HEAD,reqHeadMap);
        responseMap.put(Const.BODY, responseBodyMap);

        return JsonObjectConverter.getJSONFromObject(responseMap);
    }

}
