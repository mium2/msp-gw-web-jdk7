package com.example.service;

import com.example.dto.SampleUserDto;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.util.List;

/**
 * Created by Administrator on 2014-03-28.
 */
@Service
public class SampleTransactionService {
    @Autowired(required=true)
    @Qualifier("sqlSession_sample")  ///WEB-INF/config/context/sample-mybatis-context.xml파일에서 설정한 DB 연결세션
    private SqlSession sqlSession;

    @Autowired(required=true)
    @Qualifier("transactionManager_sample")
    private DataSourceTransactionManager transactionManager_sample;

    public void transactionInsert(List<SampleUserDto> users) throws Exception{
        //트렌젝션 구현
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = transactionManager_sample.getTransaction(def);

        int result = 0;
        try{
            for(int i=0; i<users.size(); i++) {
                SampleUserDto userDto = users.get(i);
                sqlSession.insert("Sample.insertSample", userDto);
            }
            transactionManager_sample.commit(status);
        }catch(Exception e){
        	transactionManager_sample.rollback(status);
            throw new Exception(e.toString());
        }
    }
}
