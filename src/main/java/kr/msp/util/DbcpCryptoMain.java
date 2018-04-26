package kr.msp.util;

import kr.msp.dbcp.CryptoDataSource;

/**
 * Created by IntelliJ IDEA.
 * User: mium2(Yoo Byung Hee)
 * Date: 2014-09-15
 * Time: 오후 6:28
 * To change this template use File | Settings | File Templates.
 */

//DBCP이용 패스워드, URL, 이름 암호화 값 구하기
public class DbcpCryptoMain {

    public static void main(String[] args){
        DbcpCryptoMain makeCryptoMain = new DbcpCryptoMain();
        //url 암호화
        String encUrl = makeCryptoMain.encode("jdbc:sqlserver://localhost:1433;DatabaseName=morpheus;");
        System.out.println("######### URL:"+encUrl);

        //userName 암호화
        String encName = makeCryptoMain.encode("sa");
        System.out.println("######### Name:"+encName);

        //Password 암호화
        String encPass = makeCryptoMain.encode("1110");
        System.out.println("######### Password:"+encPass);

    }
    private String encode(String str){
        CryptoDataSource cryptoDataSource = new CryptoDataSource();
        String returnEncodedStr = null;
        returnEncodedStr = cryptoDataSource.encode(str);
        return returnEncodedStr;
    }

}
