package com.example.controller;

import kr.msp.base.util.WebFilterUtil;
import kr.msp.download.view.DownLoadView;
import kr.msp.download.view.ImageView;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
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
 * Date: 2014-09-03
 * Time: 오후 2:15
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class SampleDownloadCtrl {
    @Autowired(required=true)
    private MessageSource messageSource;

    @Value("${upload.path:/tmp}")
    private String UPLOAD_ROOT_PATH;

    @RequestMapping(value = "/api/sample/download/{file_extension}/{file_id}",produces = "application/json; charset=utf8")
    public ModelAndView get(HttpServletRequest request, HttpServletResponse response,@PathVariable String file_extension, @PathVariable String file_id) throws Exception {

        // 디렉토리 경로 조작 방지 필터
        file_extension = WebFilterUtil.toWebFileFilter(file_extension);
        file_id = WebFilterUtil.toWebFileFilter(file_id);

        File lm_oAttachFile = null;

        String fileId = StringUtils.defaultString(file_id);
        if (StringUtils.isBlank(fileId) || fileId.length() > 100) {
            throw new Exception();
        }
        lm_oAttachFile = new File(UPLOAD_ROOT_PATH + "/" + file_id + "." + file_extension);
        if(file_extension.equals("jpeg") || file_extension.equals("jpg") || file_extension.equals("gif")  || file_extension.equals("png")){
            ModelAndView mv = new ModelAndView();
            mv.setView(new ImageView(lm_oAttachFile,file_extension));
            return mv;
        }else{
            ModelAndView mv = new ModelAndView();
            mv.setView(new DownLoadView(lm_oAttachFile,file_extension));
            return mv;
        }

    }

    public String getServerHostURL(HttpServletRequest request) {
        String sHostUrl = request.getScheme() + "://" + request.getServerName() +
                (request.getServerPort() > 0 ? ":" + request.getServerPort() : "") + request.getContextPath();
        sHostUrl = sHostUrl.endsWith("/") ? sHostUrl : sHostUrl + "/";
        return sHostUrl;
    }
}
