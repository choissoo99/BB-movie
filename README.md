# 🎬 MOVIEBOX v1.0

TMDB API를 기반으로 만든 반응형 영화 정보 웹사이트입니다.

인기 영화, 현재 상영작, 개봉 예정작, 평점 높은 영화부터 검색·필터·즐겨찾기·상세정보·예고편·추천 영화까지 한곳에서 확인할 수 있습니다.

## 🌐 배포 주소

**https://bb-movie-rho.vercel.app/**

## ✨ 주요 기능

- 🔥 인기 영화
- 🎬 현재 상영 중 영화
- 📅 개봉 예정 영화
- ⭐ 평점 높은 영화
- 🔎 영화 검색 및 자동완성
- 🕘 최근 검색어 저장 / 삭제
- 🎛 장르·연도·평점·정렬 필터
- ♾ 무한 스크롤
- ♥ 즐겨찾기 저장 (`localStorage`)
- 🎞 영화 상세정보
- 👥 주요 배우 및 배역
- 🎬 감독·각본가·제작자 정보
- ▶ YouTube 예고편 재생
- 📌 개봉일·관람등급·제작국가·제작사·원제·상태 표시
- 🎯 비슷한 영화 및 TMDB 추천 영화
- 🔗 상세 영화 URL 상태 유지 (`?movie=영화ID`)
- ↩ 브라우저 뒤로가기 / 앞으로가기 대응
- 📱 모바일·태블릿·데스크톱 반응형 UI
- 🌙 다크 테마
- 📦 PWA / Service Worker / 오프라인 페이지
- ⚡ API 캐시 및 이미지 lazy loading

## 🛠 사용 기술

- HTML5
- CSS3
- Vanilla JavaScript
- TMDB API
- Vercel Serverless Functions
- Vercel Hosting
- GitHub
- LocalStorage
- Service Worker / PWA

## 🔐 TMDB API 보안 구조

TMDB 인증정보는 브라우저에 직접 노출하지 않습니다.

```text
사용자 브라우저
      ↓
/api/tmdb
      ↓
Vercel Serverless Function
      ↓
TMDB API
```

프론트엔드는 `/api/tmdb`만 호출하며, 실제 TMDB API Key 또는 Read Access Token은 Vercel 환경변수에서만 사용합니다.

지원 환경변수:

```text
TMDB_ACCESS_TOKEN
```

또는

```text
TMDB_API_KEY
```

- TMDB v3 API Key(32자리 형식) 지원
- TMDB API Read Access Token 지원
- 인증정보를 GitHub 또는 클라이언트 JavaScript에 저장하지 않습니다.

## 📁 프로젝트 구조

```text
BB-movie/
├─ api/
│  └─ tmdb.js
├─ assets/
│  ├─ icons/
│  └─ images/
├─ css/
│  ├─ style.css
│  ├─ detail.css
│  └─ enhancements.css
├─ js/
│  ├─ app.js
│  └─ enhancements.js
├─ index.html
├─ manifest.webmanifest
├─ offline.html
├─ sw.js
├─ vercel.json
└─ README.md
```

## 🚀 배포 방법

1. GitHub 저장소를 Vercel 프로젝트와 연결합니다.
2. Vercel 프로젝트의 Environment Variables에 `TMDB_ACCESS_TOKEN` 또는 `TMDB_API_KEY`를 등록합니다.
3. `main` 브랜치에 push하면 Vercel Git 연동을 통해 자동 배포됩니다.
4. 배포 후 `/api/tmdb?path=popular`이 정상 응답하는지 확인합니다.

## 📱 반응형 지원

MOVIEBOX는 다음 화면 크기를 고려해 제작되었습니다.

- 데스크톱
- 태블릿
- 일반 스마트폰
- 390~430px급 작은 모바일 화면

모바일에서는 메뉴 가로 스크롤, 2열 영화 카드, 세로형 상세 버튼, 축소된 포스터·제작진·추천 카드 레이아웃을 사용합니다.

## 💾 브라우저 저장 데이터

서버 회원가입 없이 브라우저 `localStorage`를 이용합니다.

```text
movieFavorites
movieRecentSearches
```

따라서 다른 브라우저나 기기에서는 즐겨찾기와 최근 검색어가 자동 동기화되지 않습니다.

## ℹ️ TMDB 안내

This product uses the TMDB API but is not endorsed or certified by TMDB.

영화 정보와 이미지 데이터는 TMDB를 기반으로 제공합니다.

## ✅ 현재 상태

**MOVIEBOX v1.0**

핵심 기능 구현, API 연결, 모바일 대응, 코드 정리, 브라우저 히스토리 안정화까지 완료된 첫 번째 정식 버전입니다.
