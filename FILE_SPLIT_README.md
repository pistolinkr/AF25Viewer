# AF Viewer 파일 분할 안내

원본 `protein-viewer.html` 파일이 HTML, CSS, JavaScript로 분할되었습니다.

## 새로운 파일 구조

1. **protein-viewer-split.html** - 메인 HTML 파일 (외부 CSS와 JS 참조)
2. **styles.css** - 모든 스타일시트 (1031줄)
3. **app.js** - 모든 JavaScript 코드 (2161줄)

## 파일 설명

### styles.css
- 모든 CSS 스타일이 포함됨
- Apple 스타일 디자인 시스템
- 라이트/다크 테마 지원
- 반응형 디자인

### app.js
- NGL.js를 사용한 단백질 구조 시각화
- AlphaFold 및 RCSB PDB 검색 기능
- 다양한 시각화 옵션
- 측정 도구 및 개발자 모드

### protein-viewer-split.html
- 외부 CSS와 JS 파일을 참조하는 깔끔한 HTML
- 원본과 동일한 기능

## 사용 방법

분할된 파일을 사용하려면:
1. 모든 파일을 같은 디렉토리에 위치시킵니다
2. `protein-viewer-split.html`을 웹 브라우저에서 엽니다

원본 파일(`protein-viewer.html`)은 그대로 유지되어 있으므로 필요시 계속 사용할 수 있습니다.

## 주의사항

- 세 파일(HTML, CSS, JS)은 반드시 같은 폴더에 있어야 합니다
- 파일명을 변경할 경우 HTML 파일 내의 참조도 함께 수정해야 합니다
