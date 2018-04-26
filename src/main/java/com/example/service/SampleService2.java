package com.example.service;

import com.example.dto.SampleUserDto;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2014-03-27.
 */
@Service
public class SampleService2 {
    @Autowired(required=true)
    @Qualifier("sqlSession_sample")  ///WEB-INF/config/context/sample-mybatis-context.xml파일에서 설정한 DB 연결세션
    private SqlSession sqlSession;

    @Autowired(required=true)
    @Qualifier("transactionManager_sample")
    private DataSourceTransactionManager transactionManager_sample;

    public List<SampleUserDto> getUsers(Map<String,Object> reqMap){

        List<SampleUserDto> users = sqlSession.selectList("Sample.getUserList2",reqMap);

        return users;
    }

}
