-- ###############################################################################
-- #       MSP-ADMIN     Mobile
-- ###############################################################################


CREATE TABLE TB_FILE_ATTACH
(
  FILE_IDX                      INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '파일일련번호'
, FILE_ID                       VARCHAR(50)                                                     COMMENT '파일ID'
, FILE_NAME                     VARCHAR(60)                                                     COMMENT '파일명'
, FILE_EXT                      VARCHAR(10)                                                     COMMENT '파일확장자'
, FILE_PATH                     VARCHAR(200)    NOT NULL                                        COMMENT '파일경로'
, FILE_SIZE                     INTEGER                         DEFAULT 0                       COMMENT '파일사이즈'
, FILE_TYPE                     VARCHAR(1)                                                      COMMENT '파일타입'
, URL_CHILD_PATH                VARCHAR(100)    NOT NULL                                        COMMENT '자식URL경로'
, OBJ_CODE                      VARCHAR(20)     NOT NULL                                        COMMENT '대상_TABLE명'
, OBJ_ID                        VARCHAR(20)     NOT NULL                                        COMMENT 'DEPLOY_일련번호'
, REG_DATE                      TIMESTAMP       NOT NULL DEFAULT '0000-00-00 00:00:00'			COMMENT '등록일자'
, MD5                           VARCHAR(50)                                                     COMMENT 'MD5'
, PRIMARY KEY (FILE_IDX)
, INDEX TB_MOB_FILE_ATTACH_IX01 (FILE_ID)
, INDEX TB_MOB_FILE_ATTACH_IX02 (OBJ_CODE, OBJ_ID)
)
COMMENT='배포파일_다운로드';




-- ===============================================================================
-- ==                TB_MOB_SVC_UPDATE
-- ===============================================================================
CREATE TABLE TB_MOB_SVC_UPDATE
(
  APP_UP_IDX                    INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '앱업데이트순번'
, CURRENT_APP_VERSION           VARCHAR(20)     NOT NULL                                        COMMENT '현재앱버젼'
, DOWNLOAD_MARKET_URL           VARCHAR(200)                                                    COMMENT '업데이트_주소'
, DEVICE_TYPE                   VARCHAR(1)                                                      COMMENT '디바이스_유형'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일자'
, USE_YN                        VARCHAR(1)                                                      COMMENT '사용여부'
, REQUIRED_APP_VERSION          VARCHAR(20)                                                     COMMENT '필수앱버젼'
, SVC_ID                        INTEGER         NOT NULL                                        COMMENT '서비스ID'
, CHOICE_APP_VERSION            VARCHAR(100)                                                    COMMENT '선택앱버젼'
, MEMO                          VARCHAR(4000)                                                   COMMENT '업데이트_공지'
, PRIMARY KEY (APP_UP_IDX)
, FOREIGN KEY (`SVC_ID`) REFERENCES `TB_MOB_SVC` (`SVC_ID`)
)
COMMENT='앱업데이트';




CREATE TABLE TB_MOB_RSC_FILE
(
  RSC_FILE_IDX                  INTEGER        NOT NULL         AUTO_INCREMENT                  COMMENT '리소스일련번호'
, FILE_NM                       VARCHAR(100)                                                    COMMENT '파일명'
, FILE_PATH                     VARCHAR(200)                                                    COMMENT '파일경로'
, FILE_EXT                      VARCHAR(10)                                                     COMMENT '파일확장자'
, FILE_TP                       VARCHAR(10)                                                     COMMENT '파일타입'
, FILE_SIZE                     INTEGER                                                         COMMENT '파일크기'
, DEL_YN                        CHAR(1)                                                         COMMENT '삭제여부'
, STS_CD                        CHAR(1)                                                         COMMENT '상태코드'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일시'
, MOD_DTTM                      TIMESTAMP                                                       COMMENT '변경일시'
, SVC_ID                        INTEGER        NOT NULL                                         COMMENT '서비스ID'
, RSC_ID                        INTEGER                                                         COMMENT '리소스_ID'
, PRIMARY KEY (RSC_FILE_IDX)
)
COMMENT='리소스';


CREATE TABLE TB_MOB_DPLY
(
  DPLY_IDX                      INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '배포일련번호'
, DPLY_NM                       VARCHAR(50)                                                     COMMENT '배포명'
, DPLY_VER                      VARCHAR(10)                                                     COMMENT '버전'
, DPLY_TP                       CHAR(1)                                                         COMMENT '배포형태'
, USE_YN                        CHAR(1)                                                         COMMENT '사용여부'
, DPLY_FULL_YN                  CHAR(1)                                                         COMMENT '전체배포여부'
, REF_VER                       VARCHAR(10)                                                     COMMENT '참조버전'
, DPLY_DESC                     VARCHAR(255)                                                    COMMENT '비고'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일시'
, SVC_ID                        INTEGER         NOT NULL                                        COMMENT '서비스ID'
, REG_ID                        VARCHAR(20)                                                     COMMENT 'REG_ID'
, PRIMARY KEY (DPLY_IDX, SVC_ID)
, FOREIGN KEY (`SVC_ID`) REFERENCES `TB_MOB_SVC` (`SVC_ID`)
)
COMMENT='배포';


CREATE TABLE TB_MOB_DPLY_DTL
(
  DPLY_DTL_IDX                  INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '배포파일일련번호'
, FILE_NM                       VARCHAR(100)                                                    COMMENT '파일명'
, FILE_PATH                     VARCHAR(200)                                                    COMMENT '파일경로'
, FILE_SIZE                     INTEGER                                                         COMMENT '파일크기'
, DEL_YN                        CHAR(1)                                                         COMMENT '삭제여부'
, STS_CD                        CHAR(1)                                                         COMMENT '상태코드'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일시'
, DPLY_IDX                      INTEGER         NOT NULL                                        COMMENT '배포일련번호'
, SVC_ID                        INTEGER         NOT NULL                                        COMMENT '서비스ID'
, RSC_ID                        INTEGER                                                         COMMENT '리소스_ID'
, PRIMARY KEY (DPLY_DTL_IDX, DPLY_IDX, SVC_ID)
, FOREIGN KEY (`DPLY_IDX`, `SVC_ID`) REFERENCES `TB_MOB_DPLY` (`DPLY_IDX`,`SVC_ID`)
)
COMMENT='배포파일정보';




CREATE TABLE TB_MOB_NOTC
(
  NOTC_IDX                      INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '공지사항순번'
, TITLE                         VARCHAR(100)                                                    COMMENT '제목'
, CONT                          VARCHAR(2000)                                                   COMMENT '내용'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일자'
, MOD_DTTM                      TIMESTAMP                                                       COMMENT '수정일자'
, USE_YN                        VARCHAR(1)                                                      COMMENT '클라이언트출력여부'
, APP_ID                        VARCHAR(50)     NOT NULL                                        COMMENT '앱아이디'
, END_DTTM                      VARCHAR(12)                                                     COMMENT '만료일시'
, START_DTTM                    VARCHAR(12)                                                     COMMENT '게시시작일시'
, PRIMARY KEY (NOTC_IDX)
)
COMMENT='클라이언트_공지사항';


CREATE TABLE TB_MOB_EVENT_LOG
(
  LOG_IDX                       INTEGER         NOT NULL     AUTO_INCREMENT                     COMMENT '로그일련번호'
, APP_VER                       VARCHAR(20)                                                     COMMENT '앱버전'
, APP_NM                        VARCHAR(50)                                                     COMMENT '앱이름'
, OS_NM                         VARCHAR(50)                                                     COMMENT 'OS명'
, OS_VER                        VARCHAR(50)                                                     COMMENT 'OS버전'
, DEVC_ID                       VARCHAR(64)                                                     COMMENT '단말기_식별번호'
, DEVC_MD                       VARCHAR(100)                                                    COMMENT '단말기_모델명'
, PHONE_NO                      VARCHAR(20)                                                     COMMENT '전화번호'
, COMP_CD                       VARCHAR(50)                                                     COMMENT '전문코드'
, SVC_CD                        VARCHAR(50)                                                     COMMENT '서비스코드'
, USER_AGENT                    VARCHAR(150)                                                    COMMENT '브라우저_AGEN_정보'
, HOST                          VARCHAR(50)                                                     COMMENT '호스트_정보'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '생성일시'
, USER_ID                       VARCHAR(20)                                                     COMMENT '사용자_ID'
, USER_NM                       VARCHAR(20)                                                     COMMENT '사용자명'
, REQ_PAGE                      VARCHAR(50)                                                     COMMENT '요청페이지'
, SVC_ID                        INTEGER                                                         COMMENT '서비스ID'
, PRIMARY KEY (LOG_IDX)
)
COMMENT='EVENT_LOG';


CREATE TABLE TB_MOB_RSC_TEMP_FILE
(
  RSC_FILE_IDX                  INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '임시리소스일련번호'
, FILE_NM                       VARCHAR(100)                                                    COMMENT '파일명'
, FILE_PATH                     VARCHAR(200)                                                    COMMENT '파일경로'
, FILE_EXT                      VARCHAR(10)                                                     COMMENT '파일확장자'
, FILE_TP                       VARCHAR(10)                                                     COMMENT '파일타입'
, FILE_SIZE                     INTEGER                                                         COMMENT '파일크기'
, STS_CD                        CHAR(1)                                                         COMMENT '상태코드'
, REG_DTTM                      TIMESTAMP                                                       COMMENT '등록일시'
, SVC_ID                        INTEGER         NOT NULL                                        COMMENT '서비스ID'
, PRIMARY KEY (RSC_FILE_IDX)
)
COMMENT='임시리소스';


CREATE TABLE TB_MOB_RSC_EXT
(
  FILE_EXT                      VARCHAR(10)     NOT NULL
, REG_ID                        VARCHAR(20)
, MOD_ID                        VARCHAR(20)
, REG_DTTM                      TIMESTAMP
, MOD_DTTM                      TIMESTAMP
, EXE_DTL                       VARCHAR(255)
, PRIMARY KEY (FILE_EXT)
)
COMMENT='배포파일_다운로드';

--- 모바일 앱버전 관리에서 사용
-- ===============================================================================
-- ==                TB_STO_APP_VER
-- ===============================================================================
CREATE TABLE TB_STO_APP_VER
(
  APP_VER_ID                    INTEGER
, BIN_VER                       VARCHAR(100)
, PLAT_IDX                      INTEGER
, REG_DTTM                      DATETIME
, REG_ID                        VARCHAR(20)
, MOD_ID                        VARCHAR(20)
, MOD_DTTM                      DATETIME
, SVC_ID                        INTEGER         NOT NULL
, MEMO                          VARCHAR(4000)
, DOWNLOAD_MARKET_URL           VARCHAR(400)
, PRIMARY KEY (APP_VER_ID)
)
;


CREATE TABLE TB_STO_PLAT
(
  PLAT_IDX                      INTEGER         NOT NULL        AUTO_INCREMENT                  COMMENT '플랫폼정보일련번호'
, PLAT_CD                       VARCHAR(2)                                                      COMMENT '플랫폼코드'
, PLAT_DESC                     VARCHAR(4000)                                                   COMMENT '플랫폼설명'
, PLAT_NM                       VARCHAR(50)                                                     COMMENT '플랫폼명'
, MFG_CD                        VARCHAR(2)                                                      COMMENT '제조사_코드'
, REG_DTTM                      TIMESTAMP       NOT NULL                                        COMMENT '등록일시'
, MFG_NM                        VARCHAR(100)                                                    COMMENT '제조사명'
, PRIMARY KEY (PLAT_IDX)
)
COMMENT='플랫폼정보';


