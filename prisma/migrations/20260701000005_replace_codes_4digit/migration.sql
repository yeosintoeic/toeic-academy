-- 기존 20개 무제한 코드 삭제
DELETE FROM "RegisterCode" WHERE "id" LIKE 'rc_ul_%';

-- 4자리 TEST_VOCAB(모의고사+단어장) 무제한 코드 20개 삽입
INSERT INTO "RegisterCode" ("id", "code", "plan", "durationDays", "label", "createdAt") VALUES
('rc4_01', 'QF2G', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_02', 'CWTT', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_03', 'GNU6', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_04', 'TWG8', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_05', '3XFS', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_06', 'E86Z', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_07', '5Z5K', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_08', 'PJ24', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_09', 'AZGM', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_10', 'UNJN', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_11', 'YPWG', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_12', 'AYVD', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_13', 'AJ7M', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_14', 'MDWQ', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_15', 'FVH2', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_16', 'ZQ86', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_17', 'BTT5', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_18', '32YR', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_19', 'MPCA', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP),
('rc4_20', 'VUTJ', 'TEST_VOCAB', 36500, '무제한 모의고사+단어장', CURRENT_TIMESTAMP);
