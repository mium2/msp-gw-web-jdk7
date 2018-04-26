package com.example.dto;

import kr.morpheus.adapter.sap.bean.JcoClientConnectBean;

/**
 * Created by Y.B.H(mium2) on 17. 4. 19..
 */
public class JcoUserConnectBean extends JcoClientConnectBean {

    /**
     * 기본 설정 값을 설정해 주세요.
     */
    public JcoUserConnectBean(){
        super.setLang("en");
        super.setAshost("127.0.0.1");
        super.setClient("800");
        super.setUser("rfcuser01");
        super.setPasswd("rfcuser01");
        super.setSysnr("00");
        super.setPool_capacity("10");
        super.setPeak_limit("5");
    }
}
