package com.example.controller;


import kr.msp.base.util.JsonObjectConverter;
import kr.msp.constant.Const;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: mium2
 * Date: 14. 3. 18
 * Time: 오후 6:31
 * 서버 클라이언트 연동 파일업로드 사용 방법 샘플
 */

@Controller
public class SampleUploadCtrl {
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @Autowired(required=true)
    private MessageSource messageSource;

    @Value("${upload.path:/tmp}")
    private String UPLOAD_ROOT_PATH;


    @RequestMapping(value="/sample/fileUpload",method= RequestMethod.POST,produces = "application/json; charset=utf8")
    public String mobileTempUploadPost(HttpServletRequest request, HttpServletResponse response){

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
                    List<Map<String,Object>> imgInfoList = new ArrayList<Map<String, Object>>();
                    MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

                    final Map<String, MultipartFile> files = multipartRequest.getFileMap();
                    Iterator<Map.Entry<String, MultipartFile>> itr = files.entrySet().iterator();
                    MultipartFile file;
                    String filePath = "";
                    String uploadFileName = "";
                    while (itr.hasNext()) {
                        Map.Entry<String, MultipartFile> entry = itr.next();
                        System.out.println("[" + entry.getKey() + "]");
                        file = entry.getValue();

                        if (!"".equals(file.getOriginalFilename())) {
                            uploadFileName = file.getOriginalFilename();
                            String fileExtention = uploadFileName.substring(uploadFileName.lastIndexOf(".")+1,uploadFileName.length()).toLowerCase();
                            if(!fileExtention.equals("jpg") && !fileExtention.equals("gif") && !fileExtention.equals("png") && !fileExtention.equals("zip")){
                                throw new Exception("올바르지 않은 확장자 입니다");
                            }
                            filePath = UPLOAD_ROOT_PATH + File.separator  +file.getOriginalFilename();
                            file.transferTo(new File(filePath));
                        }
                        Map<String,Object> imgInfoMap = new HashMap<String, Object>();
                        imgInfoMap.put("httpurl",getServerHostURL(request)+"/"+filePath+"/"+uploadFileName);
                        imgInfoMap.put("uploadFileName",uploadFileName);
                        imgInfoMap.put("absPath",filePath);
                        imgInfoList.add(imgInfoMap);
                    }
//                    responseBodyMap.put("attachFiles",imgInfoList);
                    responseBodyMap.put("status","200");

                }else{
                    reqHeadMap.put(Const.RESULT_CODE,Const.EXCEPTION_ERROR);
                    reqHeadMap.put(Const.RESULT_MESSAGE,"ENCTYPE이 multipart/form-data가 아닙니다.");
                }

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

    public String getServerHostURL(HttpServletRequest request) {
        String sHostUrl = request.getScheme() + "://" + request.getServerName() +
                (request.getServerPort() > 0 ? ":" + request.getServerPort() : "") + request.getContextPath();
        sHostUrl = sHostUrl.endsWith("/") ? sHostUrl : sHostUrl + "/";
        return sHostUrl;
    }
}
