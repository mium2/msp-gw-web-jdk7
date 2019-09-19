-- 기능은 있으니 메뉴에 현재 없으며 거의 유명무실해진 기능으로 
-- 사용하지 않으면오류가 없다.



CREATE TABLE TB_REST_API
(
  API_IDX                       INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT 'API_IDX'
, URL_PATH                      VARCHAR(200)                                                    COMMENT 'URL_경로'
, CONTENTS                      VARCHAR(500)                                                    COMMENT '설명'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '생성일자'
, PRIMARY KEY (API_IDX)
)
COMMENT='TB_REST_API';


CREATE TABLE TB_API_AUTH_ACCESS
(
  AUTH_IDX                      INTEGER         NOT NULL                                        COMMENT '인증ACCESS_순번'
, API_IDX                       INTEGER         NOT NULL                                        COMMENT 'API_IDX'
, REG_DTTM                      CHAR(18)                                                        COMMENT '등록일시'
, PRIMARY KEY (AUTH_IDX, API_IDX)
, FOREIGN KEY (`AUTH_IDX`) REFERENCES `TB_AUTH_ACCESS` (`AUTH_IDX`)
, FOREIGN KEY (`API_IDX`) REFERENCES `TB_REST_API` (`API_IDX`)
)
COMMENT='API서비스권한액세스';


CREATE TABLE TB_AUTH_ACCESS
(
  AUTH_IDX                      INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '인증ACCESS_순번'
, ACCESS_KEY                    VARCHAR(60)     NOT NULL                                        COMMENT '접근키'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '생성일시'
, MOD_DTTM                      TIMESTAMP                                                       COMMENT '수정일시'
, USE_YN                        CHAR(1)                                                         COMMENT '사용여부'
, CONSUMER_KEY  VARCHAR(60)                                     COMMENT '컨슈머키'
, PRIMARY KEY (AUTH_IDX)
)
COMMENT='서비스_권한_액세스';


CREATE TABLE TB_MOB_DUMMY
(
  DUMMY_IDX                     INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '일련번호'
, SVC_ID                        INTEGER         NOT NULL                                        COMMENT '서비스_ID'
, API_URL                       VARCHAR(50)     NOT NULL                                        COMMENT 'API_URL'
, API_NM                        VARCHAR(255)                                                    COMMENT 'API_명'
, RSP_BODY                      VARCHAR(4000)                                                   COMMENT '응답결과(JSON_FORMAT)'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일시'
, USE_YN                        CHAR(1)                                                         COMMENT '사용여부'
, PRIMARY KEY (DUMMY_IDX)
)
COMMENT='DUMMY_API__데이터_관리';


