package com.example.controller;

import kr.msp.base.util.WebFilterUtil;
import kr.msp.base.util.httpclient.HttpClientUtil;
import kr.msp.download.view.DownLoadView;
import kr.msp.download.view.ImageView;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.config.RequestConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;

/**
 * Created by IntelliJ IDEA.
 * User: mium2(Yoo Byung Hee)
 * Date: 2015-07-14
 * Time: 오후 1:48
 */
@Controller
public class SampleDownloadProxyCtrl {

    @Value("${upload.path:/tmp}")
    private String UPLOAD_ROOT_PATH;
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    @RequestMapping(value = "/sample/proxy/download/{file_extension}/{file_id}",produces = "application/json; charset=utf8")
    public ModelAndView get(HttpServletRequest request, HttpServletResponse response,@PathVariable String file_extension, @PathVariable String file_id) throws Exception {

        // 디렉토리 경로 조작 방지 필터
        file_extension = WebFilterUtil.toWebFileFilter(file_extension);
        file_id = WebFilterUtil.toWebFileFilter(file_id);

        String fileId = StringUtils.defaultString(file_id);
        if (StringUtils.isBlank(fileId) || fileId.length() > 100) {
            throw new Exception();
        }

        HttpClientUtil httpClientUtil = new HttpClientUtil(request);
        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(5000)
                .setConnectTimeout(5000)
                .setConnectionRequestTimeout(5000)
                .build();
        // 호출할 네거시 시스템 URI
        String httpCalUrl = "http://localhost:28080/msp-gw/api/sample/download/"+file_extension+"/"+file_id;
        httpClientUtil.httpGetConnect(httpCalUrl,requestConfig);
        //네거시시트템에서 받은 파일 임시 저장
        String tmpFile = UPLOAD_ROOT_PATH + "/tmp/" + file_id + "." + file_extension;
        File lm_oAttachFile = httpClientUtil.sendForFileDownload(response,tmpFile);

        logger.debug(lm_oAttachFile.getAbsolutePath());
        ModelAndView mv = new ModelAndView();
        if(file_extension.equals("jpeg") || file_extension.equals("jpg") || file_extension.equals("gif")  || file_extension.equals("png")){
            mv.setView(new ImageView(lm_oAttachFile,file_extension));
        }else{
            mv.setView(new DownLoadView(lm_oAttachFile,file_extension));
        }
        return mv;

    }
}
