package com.example.dao;

import com.example.dto.SampleUserDto;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: 건이맘
 * Date: 14. 8. 30
 * Time: 오전 7:27
 * To change this template use File | Settings | File Templates.
 */
public interface SampleDao {

    public List<SampleUserDto> getUsers(Map<String,Object> reqMap);
}
