-- ################################################
-- ## TB_SVC
-- ################################################
-- ** 라이센스 키에 맞게 V_SVC_NM, V_SVC_ID 를 수정 하도록 한다.

        Insert into TB_SVC (SVC_ID, REG_DTTM, SVC_NM, APP_ID) Values (1, NOW(), V_SVC_NM, V_SVC_ID);


        -- ** 시스템관리 ** --
        INSERT INTO TB_SYS_MENU(                MENU_ID                                               , UP_MENU_ID                                      , POPUP_YN, POPUP_W, POPUP_H , STS_CD  , SORT_NO   , REG_ID  , REG_DTTM, MOD_ID, MOD_DTTM, MENU_DESC                     , MENU_NM                  , MENU_URL                                   )
                SELECT                          RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)        , NULL                                            , 'Y'     , NULL   , NULL    , 'Y'     ,'5'    ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '시스템 관리'            , NULL                                        UNION ALL
                        SELECT                  RIGHT(CAST( 67 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '1'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '공지사항 관리'          , '/admin/system/notice'                      UNION ALL
                        SELECT                  RIGHT(CAST( 68 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '2'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '공통코드 관리'          , '/admin/system/code'                        UNION ALL
                        SELECT                  RIGHT(CAST( 69 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '3'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '관리자 계정 관리'       , '/admin/system/user'                        UNION ALL
                        SELECT                  RIGHT(CAST( 70 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '4'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '권한 관리'              , '/admin/system/group'                       UNION ALL
                        SELECT                  RIGHT(CAST( 71 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '5'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '메뉴 관리'              , '/admin/system/menu'                        UNION ALL
                        SELECT                  RIGHT(CAST( 72 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '6'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '메뉴 권한 관리'         , '/admin/system/menuAuth'                    UNION ALL
                        SELECT                  RIGHT(CAST( 73 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '7'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '서비스 관리'            , '/admin/system/service'                     UNION ALL
                        SELECT                  RIGHT(CAST( 74 + 10000000000 AS CHAR(11)), 10)        , RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)  , 'Y'     , NULL   , NULL    , 'Y'     ,  '8'  ,     'SYSTEM', NOW(), NULL  , NULL    , NULL                           , '서비스 권한 관리'       , '/admin/system/svcauth'                     ;


        -- ##########################################
        -- ## TB_SYS_USER & AUTH & GROUP
        -- ##########################################
        -- ** 관리자 계정 등록 및 권한 그룹 생성 ** --

        INSERT INTO TB_SYS_USER (USER_ID,USER_NM,USER_PW,USE_YN,REG_DTTM, MOD_DTTM) VALUES('admin','관리자','f684991ccc8872c11f98ad407a621f5c508da88ff120071f2e2a708d4b9ac3a6','Y',NOW(), NOW());

	INSERT INTO TB_SYS_AUTH_GRP (AUTH_GRP_ID,AUTH_GRP_NM,REG_DTTM,INTRO_MENU_ID) VALUES('0000000001','슈퍼',NOW(),RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10));   -- 시스템 관리를 기본 메뉴로 설정
        INSERT INTO TB_SYS_USER_AUTH_GRP(USER_ID,AUTH_GRP_ID) VALUES('admin','0000000001');



        -- ** 시스템관리 ** --
        INSERT INTO TB_SYS_MENU_AUTH(           MENU_ID                                               , AUTH_GRP_ID   , SELECT_YN     , INSERT_YN     , UPDATE_YN     , DELETE_YN     , REG_ID        , REG_DTTM , MOD_ID, MOD_DTTM, EXCEL_YN )
                SELECT                          RIGHT(CAST( 66 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 67 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 68 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 69 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 70 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 71 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 72 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 73 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            UNION ALL
                        SELECT                  RIGHT(CAST( 74 + 10000000000 AS CHAR(11)), 10)        , '0000000001'  , 'Y'           , 'Y'           , 'Y'           , 'Y'           , 'SYSTEM'      , NOW()  , NULL  , NULL    , 'Y'            ;

          
        -- ##########################################
        -- ## TB_SYS_CD_GRP
        -- ##########################################
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST001', '공지사항구분',       '공지사항구분코드',     'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST002', '플랫폼구분',         '단말기플랫폼구분코드', 'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST003', '제조사구분',         '단말기제조사구분코드', 'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST004', '사용자단말기',       '사용자단말기구분코드', 'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST005', CONCAT('Q' , '&' , 'A구분') , CONCAT('Q' , '&' , 'A구분'),    'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST006', 'IOS배포타입',        'IOS배포타입',          'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST007', '사용상태코드',       '앱 사용상태코드',      'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('ST008', '권한유형',           '앱권한유형',           'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('PU001', '사용유무',           '사용유무그룹',         'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('PU002', '변경구분',           '그룹코드 변경구분',    'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('PU003', '페이지사이즈',       '페이지사이즈',         'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('E0001', '예약발송유형',       '예약발송유형',         'SYSTEM',       NOW(),   'KR',   'Y',    'Y');
        Insert into TB_SYS_CD_GRP   (CD_GRP_ID, GRP_NM, GRP_DESC, REG_ID, REG_DTTM, LANG_CD, USE_YN, MOD_YN) Values   ('E0002', '발송상태정보',       '발송상태',             'SYSTEM',       NOW(),   'KR',   'Y',    'Y');



        -- ##########################################
        -- ## TB_SYS_CD_INFO
        -- ##########################################
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST001', '10',  '공지',         'Y',     'KR', 1,  'SYSTEM', NOW(), '공지사항구분');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST001', '20',  '이벤트',       'Y',     'KR', 2,  'SYSTEM', NOW(), '공지사항구분');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST002', '10',  'Android',      'Y',     'KR', 1,  'SYSTEM', NOW(), '구글');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST002', '20',  'iOS',          'Y',     'KR', 2,  'SYSTEM', NOW(), 'iOS');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST002', '30',  'Windows',      'Y',     'KR', 3,  'SYSTEM', NOW(), 'Windows');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '10',  '삼성',         'Y',     'KR', 1,  'SYSTEM', NOW(), '삼성');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '20',  'LG',           'Y',     'KR', 2,  'SYSTEM', NOW(), '엘지');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '30',  '팬택',         'Y',     'KR', 3,  'SYSTEM', NOW(), '팬택');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '40',  'Sony',         'Y',     'KR', 4,  'SYSTEM', NOW(), '소니');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '41',  'HTC',          'Y',     'KR', 5,  'SYSTEM', NOW(), 'HTC');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '42',  'Motorola',     'Y',     'KR', 6,  'SYSTEM', NOW(), '모토로라');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '43',  'ZTE',          'Y',     'KR', 7,  'SYSTEM', NOW(), 'ZTE');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '44',  '애플',         'Y',     'KR', 8,  'SYSTEM', NOW(), '애플');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST003', '99',  '기타',         'Y',     'KR', 99, 'SYSTEM', NOW(), '기타');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST004', '1',   '대표단말기',   'Y',     'KR', 1,  'SYSTEM', NOW(), '대표단말기');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST004', '2',   '보조단말기',   'Y',     'KR', 2,  'SYSTEM', NOW(), '보조단말기');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST005', '10',  '질문',         'Y',     'KR', 1,  'SYSTEM', NOW(), '질문');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST005', '20',  '답변',         'Y',     'KR', 2,  'SYSTEM', NOW(), '답변');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST006', 'A',   '전부',         'Y',     'KR', 0,  'SYSTEM', NOW(), 'ALL');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST006', 'I',   'iPhone',       'Y',     'KR', 1,  'SYSTEM', NOW(), 'iPhone');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST006', 'P',   'iPad',         'Y',     'KR', 2,  'SYSTEM', NOW(), 'iPad');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST007', 'Y',   '앱사용',       'Y',     'KR', 1,  'SYSTEM', NOW(), '앱사용');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST007', 'N',   '앱사용 중지',  'Y',     'KR', 2,  'SYSTEM', NOW(), '앱사용 중지');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST008', '00',  '회원',         'Y',     'KR', 1,  'SYSTEM', NOW(), '권한유형 회원');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('ST008', '01',  '그룹',         'Y',     'KR', 2,  'SYSTEM', NOW(), '권한유형 그룹');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU001', '0',   '취소',         'Y',     'KR', 1,  'SYSTEM', NOW(), '취소');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU001', '1',   '즉시',         'Y',     'KR', 2,  'SYSTEM', NOW(), '즉시');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU001', '2',   '예약',         'Y',     'KR', 3,  'SYSTEM', NOW(), '예약');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU001', '3',   '반복',         'Y',     'KR', 4,  'SYSTEM', NOW(), '반복');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU002', '0',   '전송준비',     'Y',     'KR', 1,  'SYSTEM', NOW(), '전송준비');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU002', '1',   '전송중',       'Y',     'KR', 2,  'SYSTEM', NOW(), '전송중');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU002', '2',   '전송 완료',    'Y',     'KR', 3,  'SYSTEM', NOW(), '전송 완료');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU002', '3',   '전송 취소',    'Y',     'KR', 4,  'SYSTEM', NOW(), '전송 취소');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU003', '11',  'Hybrid App',   'Y',     'KR', 1,  'SYSTEM', NOW(), '하이브리드 앱');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU003', '12',  'Native App',   'Y',     'KR', 2,  'SYSTEM', NOW(), '네이티브 앱');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU003', '13',  'Mobile WebApp','Y',     'KR', 3,  'SYSTEM', NOW(), '모바일 웹앱');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('PU003', '14',  'Mobile Web',   'Y',     'KR', 4,  'SYSTEM', NOW(), '모바일 앱');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('E0001', 'Y',   '사용',         'Y',     'KR', 1,  'SYSTEM', NOW(), '사용여부코드');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('E0001', 'N',   '미사용',       'Y',     'KR', 2,  'SYSTEM', NOW(), '사용여부코드');
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('E0002', 'Y',   '변경가능',     'Y',     'KR', 1,  'SYSTEM', NOW(), NULL);
        Insert into TB_SYS_CD_INFO   (CD_GRP_ID, CD_ID, CD_NM, USE_YN, LANG_CD, SORT_NO, REG_ID, REG_DTTM, CD_DESC) Values   ('E0002', 'N',   '변경불가능',   'Y',     'KR', 2,  'SYSTEM', NOW(), NULL);



COMMIT;

