package com.example.dto;

/**
 * Created by Administrator on 2014-03-27.
 */
public class SampleUserDto {
    private int SEQNO = 1;
    private String USERNM = "";
    private String USERID = "";
    private String USERSN = "";

    public int getSEQNO() {
        return SEQNO;
    }

    public void setSEQNO(int SEQNO) {
        this.SEQNO = SEQNO;
    }

    public String getUSERNM() {
        return USERNM;
    }

    public void setUSERNM(String USERNM) {
        this.USERNM = USERNM;
    }

    public String getUSERID() {
        return USERID;
    }

    public void setUSERID(String USERID) {
        this.USERID = USERID;
    }

    public String getUSERSN() {
        return USERSN;
    }

    public void setUSERSN(String USERSN) {
        this.USERSN = USERSN;
    }
}
