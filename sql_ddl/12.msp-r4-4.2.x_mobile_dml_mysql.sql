
-- ##########################################
-- ## TB_SYS_MENU
-- ##########################################
-- ** 모바일관리 ** --

INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                     , MENU_NM                  , MENU_URL                                   )
SELECT                          RIGHT(CAST(  1 + 10000000000 AS CHAR(11)), 10)        , NULL                                            , 'Y'     , NULL   , NULL    , 'Y'     ,'1'    ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '모바일 관리'            , NULL                                        UNION ALL
SELECT                  RIGHT(CAST(  2 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '1'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '리소스 업로드'          , '/admin/mobile/resourceUpload'              UNION ALL
SELECT                  RIGHT(CAST(  3 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '2'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '리소스 관리'            , '/admin/mobile/resourceManage'              UNION ALL
SELECT                  RIGHT(CAST(  4 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '2'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '배포 관리'              , '/admin/mobile/rsc/deployList'              UNION ALL
SELECT                  RIGHT(CAST(  6 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '4'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '리소스 이력 관리'       , '/admin/mobile/rsc/'                        UNION ALL
SELECT                  RIGHT(CAST(  7 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '5'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '앱 업데이트 관리'       , NULL                                        UNION ALL
SELECT          RIGHT(CAST(  8 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 7 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,    '1',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '앱 바이너리 버전 관리'  , '/admin/mobile/appVersion'                  UNION ALL
SELECT          RIGHT(CAST(  9 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 7 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,    '2',     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '앱 업데이트 관리'       , '/admin/mobile/mobileService'               UNION ALL
SELECT                  RIGHT(CAST( 10 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '6'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '모바일 공지사항 관리'   , '/admin/mobile/notice'                      UNION ALL
SELECT                  RIGHT(CAST( 11 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)   , 'Y'     , NULL   , NULL    , 'Y'     ,  '7'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '리소스 파일형식 설정'   , '/admin/mobile/resourceConfig'              ;


-- ** 모바일관리 ** --

INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                               , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM , MOD_ID, MOD_DTTM, EXCEL_YN )
SELECT                          RIGHT(CAST( 1 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 2 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 3 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 4 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL                
SELECT                  RIGHT(CAST( 6 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 7 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST( 8 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT          RIGHT(CAST( 9 + 10000000000 AS CHAR(11)), 10)         , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 10 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
SELECT                  RIGHT(CAST( 11 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'           ;


-- ################################################
-- ## 앱버전관리에서 사용 TB_STO_PLAT
-- ################################################        
INSERT INTO TB_STO_PLAT ( PLAT_IDX, PLAT_CD, PLAT_DESC, PLAT_NM, MFG_CD, MFG_NM, REG_DTTM ) VALUES ( '1', '10', 'Android', '안드로이드', '10', '구글', NOW() );
INSERT INTO TB_STO_PLAT ( PLAT_IDX, PLAT_CD, PLAT_DESC, PLAT_NM, MFG_CD, MFG_NM, REG_DTTM ) VALUES ( '2', '20', 'iOS',     'iOS',        '20', '애플',  NOW() );




