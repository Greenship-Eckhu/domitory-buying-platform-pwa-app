# 🔗 Web Share Target 설정 가이드

## ⚠️ 중요: Web Share Target 동작 조건

### 1. HTTPS 필수
Web Share Target은 **HTTPS 환경에서만** 동작합니다.

#### 개발 환경 옵션:

**A. ngrok 사용 (권장)**
```bash
# 1. ngrok 설치 (없다면)
brew install ngrok

# 2. ngrok 실행 (포트 5173)
ngrok http 5173

# 3. ngrok이 제공하는 HTTPS URL 사용
# 예: https://abc123.ngrok.io
```

**B. Cloudflare Tunnel**
```bash
# 1. cloudflared 설치
brew install cloudflare/cloudflare/cloudflared

# 2. 터널 생성
cloudflared tunnel --url http://localhost:5173
```

**C. 로컬 HTTPS 인증서 (복잡함)**
```bash
# vite.config.ts에 https 설정 추가
# mkcert 등으로 로컬 인증서 생성 필요
```

### 2. PWA 설치 (홈 화면에 추가)

#### Android Chrome:
1. HTTPS URL로 접속
2. 브라우저 메뉴 → "홈 화면에 추가" 또는 "앱 설치"
3. 설치 완료 후 앱 아이콘 확인

#### iOS Safari:
1. HTTPS URL로 접속
2. 공유 버튼 탭
3. "홈 화면에 추가"
4. 추가 버튼 탭

## 📋 테스트 절차

### 1단계: 개발 서버 실행
```bash
npm run dev
# → http://localhost:5173 에서 실행됨
```

### 2단계: HTTPS 터널 생성
```bash
# ngrok 사용
ngrok http 5173
# → https://xxx.ngrok.io 주소 획득
```

### 3단계: 모바일에서 접속
- 모바일 브라우저에서 ngrok URL 열기
- 예: https://abc123.ngrok.io

### 4단계: PWA 설치
- "홈 화면에 추가" 또는 "앱 설치"
- 홈 화면에 ECKHU 아이콘 생성 확인

### 5단계: Web Share Target 확인
1. **Chrome DevTools로 확인** (데스크톱)
   ```
   1. ngrok URL 접속
   2. F12 → Application 탭
   3. Manifest 섹션 클릭
   4. "share_target" 항목 확인
   ```

2. **쿠팡 앱에서 테스트** (모바일)
   ```
   1. 쿠팡 앱 열기
   2. 상품 선택 (예: 탐사 샘물)
   3. 공유 버튼 탭
   4. 공유 대상 목록에서 "ECKHU" 확인
   5. ECKHU 선택
   6. 자동으로 /add-product 페이지 열림
   ```

## 🔍 Manifest 확인

현재 설정된 share_target:
```json
{
  "share_target": {
    "action": "/add-product",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

### 동작 방식:
- 쿠팡에서 공유 → `url` 파라미터로 상품 URL 전달
- 자동 리다이렉트: `/add-product?url=https://www.coupang.com/...`
- AddProduct 컴포넌트에서 URL 파싱

## ❌ 문제 해결

### 1. 공유 목록에 ECKHU가 안 보여요
**원인:**
- HTTP 환경 (HTTPS 필수)
- PWA 설치 안 됨
- Service Worker 등록 실패

**해결:**
```bash
# 1. HTTPS 환경 확인
curl -I https://your-ngrok-url.ngrok.io

# 2. Service Worker 확인
# Chrome DevTools → Application → Service Workers
# "dev-dist/sw.js" 확인

# 3. Manifest 확인
# Chrome DevTools → Application → Manifest
# share_target 항목 확인
```

### 2. 공유는 되는데 페이지가 안 열려요
**원인:**
- `/add-product` 라우트 미설정
- URL 파라미터 파싱 오류

**해결:**
```bash
# 1. 직접 URL 테스트
https://your-url.ngrok.io/add-product?url=https://www.coupang.com/vp/products/123

# 2. 콘솔 로그 확인
# AddProduct.tsx에서 에러 로그 확인
```

### 3. localhost에서 테스트하고 싶어요
**답변:**
- Web Share Target은 **HTTPS 필수**
- localhost는 지원 안 됨
- 반드시 ngrok 등 터널 사용 필요

## 📱 지원 브라우저

| 브라우저 | Web Share Target | 비고 |
|---------|------------------|------|
| Chrome (Android) | ✅ | 완벽 지원 |
| Edge (Android) | ✅ | 완벽 지원 |
| Safari (iOS) | ⚠️ | iOS 15.4+ 부분 지원 |
| Firefox (Android) | ❌ | 미지원 |

## 🚀 프로덕션 배포 시

### Vercel/Netlify 배포 후:
1. 자동으로 HTTPS 제공됨
2. PWA 자동 설치 가능
3. Web Share Target 정상 작동

### 배포 체크리스트:
- [ ] HTTPS 도메인 확인
- [ ] manifest.webmanifest 생성 확인
- [ ] Service Worker 등록 확인
- [ ] 모바일에서 PWA 설치 테스트
- [ ] 쿠팡 공유 → ECKHU 선택 테스트

## 📖 참고 자료

- [Web Share Target API - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest/share_target)
- [VitePWA Documentation](https://vite-pwa-org.netlify.app/)
- [PWA Builder](https://www.pwabuilder.com/)

## 💡 팁

### 빠른 테스트 방법:
```bash
# Terminal 1: 개발 서버
npm run dev

# Terminal 2: ngrok 터널
ngrok http 5173

# 모바일에서:
# 1. ngrok URL 접속
# 2. PWA 설치
# 3. 쿠팡에서 공유 테스트
```

### Manifest 즉시 반영:
```bash
# 1. PWA 제거 (홈 화면에서 삭제)
# 2. 브라우저 캐시 클리어
# 3. Service Worker Unregister
# 4. 페이지 새로고침
# 5. PWA 재설치
```

---

현재 개발 서버: **http://localhost:5173/**

HTTPS 테스트를 위해 ngrok을 실행하세요! 🚀
