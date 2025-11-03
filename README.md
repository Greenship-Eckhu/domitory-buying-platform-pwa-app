# ECKHU PWA App

TypeScript + React + Vite로 구축된 Progressive Web Application

## 주요 기능

- TypeScript 완전 지원
- PWA (Progressive Web App) 지원
- 반응형 디자인 (최대 width: 480px)
- Bottom Navigation (4개 메뉴)
- React Router를 통한 페이지 라우팅
- 다크모드 지원
- iOS Safe Area 대응

## 반응형 설정

모든 디바이스에서 일관된 모바일 경험을 제공하기 위해:
- 최대 너비: 480px로 제한
- 큰 화면에서는 중앙 정렬 및 shadow 적용
- 작은 화면에서는 전체 너비 사용

## 개발

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드된 앱 미리보기
npm preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── BottomNavigation.tsx
│   └── BottomNavigation.css
├── pages/
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── Favorites.tsx
│   └── Profile.tsx
├── styles/
│   └── index.css
├── App.tsx
├── App.css
└── main.tsx
```

## 기술 스택

- React 19
- TypeScript 5
- Vite 6
- React Router 7
- vite-plugin-pwa

## URL

http://localhost:5173/
