package kr.msp;

import com.google.gson.Gson;
import kr.morpheus.adapter.sap.bean.JcoClientConnectBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Y.B.H(mium2) on 17. 9. 20..
 */
public class TestMain {

    public static void main(String args[]){
        String jsonStr = "{\"body\":{\"status\":\"200\"},\"head\":{\"result_code\":\"200\",\"result_msg\":\"Success\"}}";
        Gson gson = new Gson();
        gson.fromJson(jsonStr,Map.class);


//        {"body":{"status":"200"},"head":{"result_code":"200","result_msg":"Success"}}
//        TestMain testMain = new TestMain();
//
//        T1 t1 = new T1(testMain);
//        t1.start();
//
//        T2 t2 = new T2(testMain);
//        t2.start();
//
//        T3 t3 = new T3(testMain);
//        t3.start();
//
//
//        while (true){
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//
//            StackTraceElement[] stackTraceElements1 = t1.getStackTrace();
//            StackTraceElement[] stackTraceElements2 = t2.getStackTrace();
//            StackTraceElement[] stackTraceElements3 = t3.getStackTrace();
//
//            for(StackTraceElement stackTraceElement1 : stackTraceElements1){
//                System.out.println("[T1]"+stackTraceElement1.getMethodName() +":"+ stackTraceElement1.toString());
//            }
//
//            for(StackTraceElement stackTraceElement2 : stackTraceElements2){
//                System.out.println("[T2]"+stackTraceElement2.getMethodName() +":"+ stackTraceElement2.toString());
//            }
//
//            for(StackTraceElement stackTraceElement3 : stackTraceElements3){
//                System.out.println("[T3]"+stackTraceElement3.getMethodName() +":"+ stackTraceElement3.toString());
//            }
//        }
    }


    List<Boolean> appAgents = new ArrayList<Boolean>();

    public synchronized String waitTest(){

        String returnVal = "";
        int maxSize = 5;
        int i = 0;
        while (i < maxSize) 	// Thread Size가 0 보다 크면
        {
            if (i < appAgents.size()) // appAgent List 사이즈
            {
                boolean isAgentUse = (Boolean) appAgents.get(i);
                if (!isAgentUse) {
                    returnVal = "["+i+"]"+"SUCCESS";
                    break;
                }
            } else {
                appAgents.add(true);
                returnVal = "["+i+"]"+"SUCCESS";
                break;
            }

            i++;
            //
            if (i >= maxSize) {
                i = 0;
                try {
                    System.out.println("!!!!!! 잠듬");
                    this.wait();
                    System.out.println("!!!!!! 잠에서 깨어남");
                    appAgents.remove(3);
                    appAgents.add(3,false);
                } catch (InterruptedException e) {
                    System.out.println("Max wait Thread wake UP!");
                }
            }
        }

        return returnVal;
    }

    public synchronized void release() {
        int maxCount = 5;
        System.out.println("##### iList.size():" + appAgents.size() + "    maxCount:" + maxCount);
        if (appAgents.size() > maxCount) {
            appAgents.remove(0);
            System.out.println("###### MAX 카운트가 넘어 삭제함");
        } else {
            appAgents.remove(0);
//            appAgents.add(0, false);
            System.out.println("###### 상태만 false로 변경");
        }

        this.notifyAll();
    }

    public void sendMsg(){
        try {
            Thread.sleep(60*1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}

class T1 extends Thread{
    private final TestMain testMain;
    public T1(TestMain _testMain){
        this.testMain = _testMain;
    }

    @Override
    public void run() {
        while (true) {
            System.out.println(testMain.waitTest());
            try {
                testMain.sendMsg();
            } catch (Exception e) {
                e.printStackTrace();
            }finally {
                testMain.release();
            }
        }
    }
}

class T2 extends Thread{
    private final TestMain testMain;
    public T2(TestMain _testMain){
        this.testMain = _testMain;
    }

    @Override
    public void run() {
        while (true) {
            System.out.println(testMain.waitTest());
            try {
                testMain.sendMsg();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                testMain.release();
            }
        }
    }

}
class T3 extends Thread{
    private final TestMain testMain;
    public T3(TestMain _testMain){
        this.testMain = _testMain;
    }

    @Override
    public void run() {
        while (true) {
            System.out.println(testMain.waitTest());
            try {
                testMain.sendMsg();
            } catch (Exception e) {
                e.printStackTrace();
            }finally {
                testMain.release();
            }
        }
    }

}