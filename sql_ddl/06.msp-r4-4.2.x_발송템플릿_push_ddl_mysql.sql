
-- ###############################################################################
-- #       MSP-ADMIN     push
-- ###############################################################################
CREATE TABLE `TB_CMP_TEMPLATE` (
  `TEMPLATE_CODE` varchar(20) NOT NULL COMMENT '템플릿 코드',
  `TEMPLATE_TITLE` varchar(20) NOT NULL COMMENT '템플릿 제목',
  `MESSAGE` varchar(4000) DEFAULT NULL COMMENT '메시지 내용',
  `SUB_MESSAGE` text COMMENT '내용(EXT)',
  `WEBEDIT` text COMMENT 'webedit 내용',
  `IMAGE_URL` text COMMENT '이미지 URL',
  `VIDEO_URL` text COMMENT '동영상 내용',
  `REPLACE_YN` varchar(2) DEFAULT NULL COMMENT '치환발송 여부',
  `CATEGORY_TYPE` varchar(2) DEFAULT NULL COMMENT '템플릿유형',
  `REG_ID` varchar(20) DEFAULT NULL COMMENT '등록자ID',
  `REG_DT` datetime DEFAULT NULL COMMENT '등록일',
  `MOD_ID` varchar(20) DEFAULT NULL COMMENT '수정자ID',
  `MOD_DT` datetime DEFAULT NULL COMMENT '수정일',
  PRIMARY KEY (`TEMPLATE_CODE`),
  UNIQUE KEY `QK_TEMPLATE_TEMPLATECODE` (`TEMPLATE_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='푸시_템플릿';


