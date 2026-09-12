# MOVIEBOX

TMDB API를 이용한 영화 정보 웹사이트입니다.

## 주요 기능
- 인기 영화 / 현재 상영 / 개봉 예정 / 평점 높은 영화
- 영화 검색 및 자동완성
- 영화 상세정보, 출연진, 예고편, 비슷한 영화
- 즐겨찾기(localStorage)
- 장르/연도/평점/정렬 필터
- 무한 스크롤
- PWA / Service Worker / 오프라인 페이지
- 반응형 다크 테마

## 환경변수
Vercel 프로젝트에 아래 환경변수를 등록해야 합니다.

`TMDB_ACCESS_TOKEN`

TMDB 토큰은 클라이언트 코드나 GitHub에 커밋하지 않습니다.

## 배포
GitHub 저장소를 Vercel에 Import한 뒤 환경변수를 등록하고 배포합니다.
