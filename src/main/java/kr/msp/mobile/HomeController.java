package kr.msp.mobile;

import java.text.DateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.msp.base.dto.MobileMap;
import kr.msp.core.license.LicenseValidator;
//2013.11.04 수정 에러때문에
//import kr.msp.server.bind.annotation.CommandMapping;
import kr.msp.server.mvc.annotation.CommandMapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.ModelAndView;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	@Autowired
	private ConfigurableApplicationContext applicationContext;
	
	
	@Autowired
	private LicenseValidator licenseValidator;
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = {RequestMethod.GET})
	public @ResponseBody HashMap<String,String> home(HttpServletRequest request, Locale locale, Model model) {
				
		
		PropertiesPropertySource props = (PropertiesPropertySource) applicationContext.getEnvironment().getPropertySources().get("msp-properties");
		logger.info("Welcome home!!!! The client locale is {}.", locale);
//		logger.info("vresource.download.url::::::" + props.getProperty("resource.download.url"));
		//new Config();
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
//		System.out.println("vresource.download.url::::::" + props.getProperty("resource.download.url"));
		
		
		HashMap<String, String> result = new HashMap<String, String>();
		result.put("Hello", "World");
		return result;
	}
	
	@RequestMapping(value={"/interface.do"}, method=RequestMethod.GET)
	@CommandMapping(value="account")
	@ResponseBody
	public HashMap<String,String> textgram(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		HashMap<String, String> result = new HashMap<String, String>();
		result.put("Msp", "Account");
		return result;
	}

}
