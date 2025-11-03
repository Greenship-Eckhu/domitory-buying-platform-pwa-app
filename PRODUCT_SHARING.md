# 🛍️ 공동구매 상품 추가 기능

React 기반 PWA로 구현된 쿠팡 상품 공유 기능입니다.

## ✨ 주요 기능

### 1. Web Share Target API
- 쿠팡 앱에서 상품을 공유하면 자동으로 ECKHU PWA가 실행됩니다
- `manifest.json`의 `share_target` 설정으로 구현

### 2. 자동 상품 정보 추출 (JSON-LD 기반)
- **JSON-LD 구조화 데이터 우선 파싱**
  - `name` - 상품명 (예: "탐사 샘물, 2L, 12개")
  - `image` - 썸네일 이미지 배열 (첫 번째 이미지 사용)
  - `offers.price` - 할인 가격 (예: "5890")
  - `offers.priceSpecification.price` - 원가 (예: "9980")
- **Open Graph 메타 태그 fallback**
  - JSON-LD 파싱 실패 시 `og:title`, `og:image` 사용

### 3. 지능형 수량 파싱
상품명에서 수량 정보를 자동으로 추출합니다:
- `12개입` → 12개
- `500g` → 500g
- `1.5L` → 1.5L
- `24팩` → 24팩
- `500ml x 24개` → 500ml, 24개

### 4. 사용자 입력 폼
자동 추출이 불가능한 경우 사용자에게 직접 입력을 요청:
- 가격 입력
- 수량 및 단위 입력

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Screen.tsx          # 공통 스크린 컴포넌트 (Header 포함)
│   ├── Header.tsx          # 헤더 컴포넌트 (뒤로가기 버튼)
│   ├── ScrollView.tsx      # 스크롤 가능한 컨테이너
│   └── BottomNavigation.tsx # 하단 네비게이션
├── pages/
│   └── AddProduct.tsx      # 상품 추가 페이지
├── services/
│   └── productService.ts   # Open Graph 파싱 서비스
├── utils/
│   ├── urlParser.ts        # URL 파싱 및 플랫폼 감지
│   └── quantityParser.ts   # 수량 정보 추출
├── types/
│   └── product.ts          # 타입 정의
└── constants/
    └── theme.ts            # 테마 색상 정의
```

## 🚀 사용 방법

### 개발 환경
```bash
npm install
npm run dev
```

### PWA로 실행 (Web Share Target 테스트)
1. 개발 서버 실행
2. Chrome DevTools → Application → Manifest 확인
3. 쿠팡/네이버쇼핑 상품 공유 시 ECKHU 선택

### 테스트 방법
1. 홈 화면의 "상품 추가 테스트" 버튼 클릭
2. 또는 직접 URL 접근: `http://localhost:5173/add-product?url=<상품URL>`

## 🔧 기술 스택

- **React 18** + TypeScript
- **styled-components** - CSS-in-JS
- **React Router** - 라우팅
- **Web Share Target API** - 공유 기능
- **DOMParser** - HTML 파싱
- **정규식** - 수량 정보 추출

## 📱 지원 플랫폼

### ✅ 쿠팡
- **URL 패턴**: `coupang.com/vp/products/*` 또는 `coupang.com/products/*`
- **파싱 방식**: JSON-LD 구조화 데이터 (Schema.org Product)
- **추출 정보**:
  - 상품명 (옵션 정보 포함)
  - 썸네일 이미지 (여러 이미지 중 첫 번째)
  - 할인가 및 원가
  - 상품 설명
  - 브랜드 정보
- **샘플 URL**: `https://www.coupang.com/vp/products/7689270513?itemId=20877904723&vendorItemId=87945140904`
- **실제 예시**: "탐사 샘물, 2L, 12개" - 5,890원 (정상가 9,980원)

## 🎨 UI/UX 특징

1. **로딩 상태**: 스피너와 메시지로 사용자 피드백
2. **에러 처리**: 명확한 에러 메시지와 재시도 옵션
3. **반응형 디자인**: 모바일 최적화 (max-width: 480px)
4. **직관적인 폼**: 자동 입력 + 수동 입력 하이브리드
5. **플랫폼 뱃지**: 쿠팡/네이버 구분 표시

## 🔐 CORS 처리

브라우저 CORS 제한을 우회하기 위해 프록시 사용:
- `api.allorigins.win`
- `corsproxy.io`

프로덕션 환경에서는 백엔드 서버에서 처리 권장.

## 🔍 쿠팡 구조 분석

### JSON-LD 데이터 구조
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "sku": "7689270513-20877904723",
  "name": "탐사 샘물, 2L, 12개",
  "image": ["https://thumbnail.coupangcdn.com/..."],
  "description": "현재 별점 4.9점, 리뷰 193659개...",
  "brand": {"@type": "Brand", "name": "탐사"},
  "offers": {
    "@type": "Offer",
    "price": "5890",
    "priceCurrency": "KRW",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "9980",
      "priceType": "https://schema.org/StrikethroughPrice"
    }
  }
}
```

### 옵션 처리
- 쿠팡은 **옵션(용량, 수량)별로 별도 상품 URL**이 있음
- 현재는 **기본 선택된 옵션의 정보**만 가져옴
- 예: 500ml, 1L, 2L → 각각 다른 `itemId`와 `vendorItemId`
- 사용자가 공유한 URL의 옵션이 기본값으로 설정됨

## 📝 향후 개선 사항

- [ ] 백엔드 API 연동 (상품 저장)
- [ ] 이미지 프록시/CDN 적용
- [ ] 옵션 선택 UI (여러 옵션이 있는 경우)
- [ ] 상품 목록 관리 기능
- [ ] 공동구매 그룹 생성/관리
- [ ] 알림 기능 (가격 변동, 구매 마감 등)
- [ ] 다른 쇼핑몰 지원 고려 (11번가, G마켓 등)

## 🧪 테스트 예시

```typescript
// URL 파싱 테스트
detectPlatform('https://www.coupang.com/products/123') // 'coupang'
isValidProductUrl('https://www.coupang.com/products/123') // true

// 수량 파싱 테스트
parseQuantityFromText('맛있는 사과 12개입')
// { quantity: 12, unit: '개', original: '12개입' }

parseQuantityFromText('우유 500ml x 24팩')
// 여러 수량 추출 가능
```

## 📄 라이센스

MIT License
