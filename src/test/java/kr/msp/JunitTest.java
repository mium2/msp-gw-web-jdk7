package kr.msp;

import com.example.dto.SampleUserDto;
import com.example.service.SampleService2;
import com.mysql.jdbc.jdbc2.optional.MysqlConnectionPoolDataSource;
import junit.framework.TestCase;
import kr.msp.base.util.JsonObjectConverter;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.naming.NamingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by Y.B.H(mium2) on 2015. 12. 28..
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/config/context/root-context.xml",
        "file:src/main/webapp/WEB-INF/config/context/mybatis-context.xml",
        "file:src/main/webapp/WEB-INF/config/context/msp-gw-context.xml"})
public class JunitTest extends TestCase{

    private static final String url = "jdbc:mysql://211.241.199.214:3306/MSP_IDB?characterEncoding=UTF-8";
    private static final String username = "MSP_ADMIN";
    private static final String password = "!dusrnthdjemals!";
    private static final String jndiName = "jdbc/msp_mysql";

    @BeforeClass
    public static void setUpClass() throws Exception {
        try {
            final SimpleNamingContextBuilder builder = new SimpleNamingContextBuilder();
            MysqlConnectionPoolDataSource ds = new MysqlConnectionPoolDataSource();
//            OracleConnectionPoolDataSource ds = new OracleConnectionPoolDataSource();
            ds.setURL(url);
            ds.setUser(username);
            ds.setPassword(password);
            builder.bind(jndiName, ds);
            builder.activate();
        } catch (NamingException ex) {
            ex.printStackTrace();
        }
    }

    @Autowired (required = true)
    private SampleService2 sampleService2;
    @Test
    public void junitTestPrint() throws Exception{
        System.out.println("########222");
        Map<String,Object> reqMap = new HashMap<String, Object>();
        List<SampleUserDto> users = sampleService2.getUsers(reqMap);
        String resultString = JsonObjectConverter.getJSONFromObject(users);
        System.out.println("#### resultString:"+resultString);
    }

    protected void tearDown() throws Exception {
        System.out.println("Test...: Tearing down tests");
    }


}
