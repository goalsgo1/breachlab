## 목표
replay-guard의 NonceGuardedTransfer에 nonce TTL(expiry) 기능을 추가하고, 실행 가능한 검증과 README/HANDOFF를 정리한다.

## 현재 상태
- 완료: `nonce-guard.js`에 두 번째 인수 `ttlMs`(기본 60000), `request.timestamp` 만료 검사(`expired`), 만료 nonce 정리 추가.
- 완료: `nonce-guard.test.js` 작성 — `node replay-guard/nonce-guard.test.js` 통과 (ok → replayed_nonce → expired, 만료 정리, bad_signature, 레거시 동작 포함).
- 완료: `replay-guard/README.md`의 'Not production-ready' 단락에서 Set/expiry 설명을 현재 구현에 맞게 수정.
- 미커밋: 변경 3개 파일이 working tree에만 있음.

## 다음 할 일
1. 변경분을 커밋할지 사용자에게 확인하고, 원하면 커밋/PR 생성.
2. 배포 수준 확장 시 분산 저장소, clock-skew 처리, 주기적 정리(background sweep) 추가.
3. README의 'Verified by capture-and-replay' 예시에 expired/TTL 흐름을 추가할지 검토.

## 결정과 이유
- `usedNonces`는 Set → Map(nonce → 요청 timestamp)로 변경. TTL 판정·정리에 timestamp가 필요하며 README의 Set 언급도 함께 수정함.
- 검사 순서는 signature → expiry → replay. 오래된 재전송은 `expired`, TTL 이내 재전송은 기존대로 `replayed_nonce`를 유지하기 위함.
- timestamp가 없거나 유한 숫자가 아니면 만료 검사를 생략해 기존 호출 동작을 보존.
- 만료 판정은 strict `>`: `now - timestamp > ttlMs`일 때만 expired.

## 실행 방법
```bash
node replay-guard/nonce-guard.test.js
```

## 막힌 것·주의
- git push/커밋은 하지 않음(사용자 요청 시에만).
- TTL은 메모리 내부에서만 동작하며, 서버 간 공유·시계 오차 보정은 없음.
- `executeTransfer`가 모듈 외부 전역 함수인 기존 구조를 유지함. 테스트에서 `global.executeTransfer`를 정의해 사용.

2026-10-22 15:51 KST
