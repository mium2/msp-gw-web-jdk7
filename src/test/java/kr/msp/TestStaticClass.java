package kr.msp;

import kr.morpheus.adapter.sap.bean.JcoClientConnectBean;

/**
 * Created by Y.B.H(mium2) on 17. 9. 19..
 */
public class TestStaticClass {

    public static JcoClientConnectBean jcoClientConnectBean = new JcoClientConnectBean();
    static {
        jcoClientConnectBean.setLang("en");
        jcoClientConnectBean.setAshost("127.0.0.1");
        jcoClientConnectBean.setClient("800");
        jcoClientConnectBean.setUser("rfcuser01");
        jcoClientConnectBean.setPasswd("rfcuser01");
        jcoClientConnectBean.setSysnr("00");
        jcoClientConnectBean.setPool_capacity("10");
        jcoClientConnectBean.setPeak_limit("5");
    }
    public TestStaticClass(){

    }
}
