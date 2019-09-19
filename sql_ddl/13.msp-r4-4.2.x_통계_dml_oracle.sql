

-- ** 통계 top menu** --
INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                , MENU_NM                  , MENU_URL                                   )
SELECT                          RIGHT(CAST( 38 + 10000000000 AS CHAR(11)), 10)        , NULL                                            , 'Y'     , NULL   , NULL    , 'Y'     ,'3'    ,     'SYSTEM', NOW(), NULL  , NULL    , '통계를 조회합니다.'           , '통계'                   , NULL                                        ;

INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                              , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM, MOD_ID, MOD_DTTM, EXCEL_YN )
SELECT                          RIGHT(CAST(38 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            ;
	
commit;


-- ** 모바일 통계 menu** -- 
INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                , MENU_NM                  , MENU_URL                                   )
SELECT                  RIGHT(CAST( 39 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 38 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '1'  ,     'SYSTEM', NOW(), NULL  , NULL    , '전문통계를 조회'              , '모바일 통계'            , NULL                                         UNION ALL
SELECT          RIGHT(CAST( 40 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 39 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , '기간별 사용통계'              , '기간별 사용통계'        , '/admin/mobile/statistics/periodStat'        UNION ALL
SELECT          RIGHT(CAST( 41 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 39 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '2',     'SYSTEM', NOW(), NULL  , NULL    , 'OS별 통계'                    , 'OS별 통계'              , '/admin/mobile/statistics/OSStat'            UNION ALL
SELECT          RIGHT(CAST( 42 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 39 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '3',     'SYSTEM', NOW(), NULL  , NULL    , '사용자 일별 사용통계'         , '사용자 일별 사용통계'   , '/admin/mobile/statistics/userStat'          UNION ALL
SELECT          RIGHT(CAST( 43 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 39 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '4',     'SYSTEM', NOW(), NULL  , NULL    , '전문 일별 사용통계'           , '전문 일별 사용통계'     , '/admin/mobile/statistics/protocolStat'   ;


INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                              , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM, MOD_ID, MOD_DTTM, EXCEL_YN )
SELECT                  RIGHT(CAST(39 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(40 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(41 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(42 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(43 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            ;


commit;


-- ** store 통계 menu** -- 
INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                , MENU_NM                  , MENU_URL                                   )
SELECT                  RIGHT(CAST( 44 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 38 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '2'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '스토어 통계'            , NULL                                         UNION ALL
SELECT          RIGHT(CAST( 45 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 44 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '가입자 현황'            , '/admin/store/statistics/join'               UNION ALL
SELECT          RIGHT(CAST( 46 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 44 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '2',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '다운로드 현황'          , '/admin/store/statistics/download'           ;

INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                              , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM, MOD_ID, MOD_DTTM, EXCEL_YN )
SELECT                  RIGHT(CAST(44 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(45 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(46 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            ;


commit;


-- ** push 통계 menu** --
INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                , MENU_NM                  , MENU_URL                                   )
SELECT                  RIGHT(CAST( 47 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 38 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '3'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , 'PUSH 통계'              , NULL                                   UNION ALL      
SELECT          RIGHT(CAST( 48 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 47 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '기간별 가입통계'         , '/admin/push/regUserStat'                   UNION ALL
SELECT          RIGHT(CAST( 84 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 47 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '서버별 가입통계'         , '/admin/push/regPnsidStat'                   UNION ALL
SELECT          RIGHT(CAST( 85 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 47 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '일별 발송통계'         , '/admin/push/sysSentStatus'                   UNION ALL
SELECT          RIGHT(CAST( 92 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 47 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '메세지별 통계'         ,  '/admin/push/staticsMsg'			;


INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                              , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM, MOD_ID, MOD_DTTM, EXCEL_YN )
SELECT                  RIGHT(CAST(47 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(48 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(84 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST(85 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'			UNION ALL
SELECT          RIGHT(CAST(92 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'			;


commit;