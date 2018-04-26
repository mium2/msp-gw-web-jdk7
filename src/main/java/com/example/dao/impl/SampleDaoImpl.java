package com.example.dao.impl;

import com.example.dao.SampleDao;
import com.example.dto.SampleUserDto;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: 건이맘
 * Date: 14. 8. 30
 * Time: 오전 7:27
 * To change this template use File | Settings | File Templates.
 */
@Repository
public class SampleDaoImpl implements SampleDao{
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
