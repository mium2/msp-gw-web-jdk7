package kr.msp.mobile;

import kr.msp.dbcp.CryptoDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by IntelliJ IDEA.
 * User: mium2(Yoo Byung Hee)
 * Date: 2014-09-16
 * Time: 오후 2:10
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class DbcpCryptoController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/dbcpEncode", method = {RequestMethod.GET})
    public ModelAndView dbcpEncodeGet(HttpServletRequest request, HttpServletResponse response) {

        logger.info("############# dbcpEncode call~~!");
        ModelAndView mv = new ModelAndView();
        mv.setViewName("jsp/dbcpEncode");

        return mv;
    }

    @RequestMapping(value = "/dbcpEncode", method = {RequestMethod.POST})
    public ModelAndView dbcpEncodePost(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("###########post");
        String encURL = "";
        String encName = "";
        String encPass = "";
        CryptoDataSource cryptoDataSource = new CryptoDataSource();
        System.out.println("###########"+request.getParameter("dbcpUrl"));
        if(request.getParameter("dbcpUrl")!=null){
            encURL = cryptoDataSource.encode(request.getParameter("dbcpUrl"));
        }
        if(request.getParameter("dbcpName")!=null){
            encName = cryptoDataSource.encode(request.getParameter("dbcpName"));
        }
        if(request.getParameter("dbcpPasswd")!=null){
            encPass = cryptoDataSource.encode(request.getParameter("dbcpPasswd"));
        }

        System.out.println("########### encURL:"+encURL);
        System.out.println("########### encName:"+encName);
        System.out.println("########### encPass:"+encPass);
        ModelAndView mv = new ModelAndView();
        mv.setViewName("jsp/dbcpEncode");
        mv.addObject("encURL",encURL);
        mv.addObject("encName",encName);
        mv.addObject("encPass",encPass);
        return mv;
    }
}
