package com.example.controller;

import kr.msp.base.util.WebFilterUtil;
import kr.msp.download.view.ImageView;
import org.springframework.beans.factory.annotation.Autowired;
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
 * Time: 오후 4:20
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class SampleImageDownCtrl {
    @Autowired(required=true)
    private MessageSource messageSource;

    @Value("${upload.path:/tmp}")
    private String UPLOAD_ROOT_PATH;
    @RequestMapping(value="/http/down/image/{file_extension}/{file_id}" ,produces = "application/json; charset=utf8")
    public ModelAndView getImage2(HttpServletRequest request, HttpServletResponse response,@PathVariable String file_extension, @PathVariable String file_id) {

        file_extension = WebFilterUtil.toWebFileFilter(file_extension);
        file_id= WebFilterUtil.toWebFileFilter(file_id);
        File lm_oAttachFile = new File(UPLOAD_ROOT_PATH + "/" + file_id + "." + file_extension);

        ModelAndView mv = new ModelAndView();
        mv.setView(new ImageView(lm_oAttachFile,file_extension));
        return mv;
    }
}
