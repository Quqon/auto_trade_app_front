# Changelog

이 파일은 프로젝트의 주요 변경 사항을 날짜별로 기록합니다.
수정 후 원복한 경우, 그 이유도 함께 기재합니다.

---

## 📅 [2026-08-26]

### ✨ 신규 기능
- **OAuth 2.0 연동 (Kakao, Naver, Google)**
  - `src/pages/Auth.jsx`: 카카오, 네이버, 구글 소셜 로그인 버튼 및 백엔드 인가 URL로의 리다이렉션 추가
  - `src/pages/OAuth2RedirectHandler.jsx`: 소셜 로그인 성공 시 백엔드로부터 전달받은 JWT 토큰을 로컬 스토리지에 저장하고 앱 메인 화면으로 이동시키는 핸들러 컴포넌트 추가
  - `src/App.jsx`: `/oauth2/redirect` 라우트 등록

### ♻️ 리팩토링 및 버그 수정
- **프론트엔드 인증 로직 전면 개편 (HttpOnly 쿠키 방식 도입)**
  - `src/contexts/AuthContext.jsx`: 앱 구동 시 `/api/user/me`를 호출하여 쿠키 기반 전역 인증 상태를 관리하는 `AuthProvider` 도입 (axios `withCredentials = true` 일괄 적용)
  - `src/App.jsx`: 최상단 컴포넌트에 `AuthProvider` 래핑
  - `src/pages/Auth.jsx`, `src/pages/MyPage.jsx`, `src/pages/Account.jsx`: `localStorage`에 의존하던 JWT 토큰 발급 및 사용 코드를 모두 제거하고 `useAuth` 훅으로 상태 조회 및 백엔드 로그아웃 통신으로 일원화
  - `src/contexts/AuthContext.jsx`: 비정상적인 인증 시나리오에서 백엔드가 HTML(기본 로그인 페이지)을 반환할 때 이를 사용자 정보로 착각하여 렌더링 에러가 발생하는 현상 방어(HTML 포함 시 `user` = `null` 처리)
- **UI 및 가시성 개선**
  - `src/pages/Account.jsx`: 비밀번호 확인 후 나타나는 `readOnly` 텍스트 필드들의 글자색(`var(--text-muted)`)이 배경색과 대비되지 않아 데이터가 없는 것처럼 보이던 착시 현상 해결 (색상/투명도 조정)

---

## 📅 [2026-08-25]

### 🗑 원복 내역
- **`src/components/Layout.jsx` — 뒤로가기 버튼 제거**
  - **원복 이유**: 모바일 앱 특성상 하단 네비게이션만으로 충분하다고 판단하여 불필요한 UI 요소로 판단되어 반려됨
- **`AuthService.java` — 임시 비밀번호 발급 기능 및 `TempPasswordResponse` DTO 제거**
  - **원복 이유**: 임시 비밀번호 발급 시 사용자가 로그인 후 다시 변경해야 하는 번거로움 존재. 비밀번호 찾기 과정에서 직접 새 비밀번호를 설정하도록 UX 개선 목적.

### ✨ 신규 기능
- **`src/pages/Welcome.jsx` — 앱 첫 진입 웰컴 페이지 생성**
  - 앱 아이콘, 헤드라인, 수치 뱃지 구성 (Glassmorphism)
  - "로그인 없이 둘러보기" (게스트 진입), "로그인 / 회원가입" 버튼 제공
- **`src/pages/MyPage.jsx` — 마이페이지 생성**
  - 로그인 상태: 프로필 카드, 설정/고객센터 메뉴, 로그아웃 기능
  - 비로그인 상태: 게스트 모드 안내 및 로그인 유도
- **`src/pages/Search.jsx` — 종목 검색 페이지 생성**
  - 실시간 인기 종목(더미) 순위별 색상 표시 및 검색창 연동
  - 최근 검색 목록 (로컬스토리지 영속 저장, 칩 UI, 개별/전체 삭제 기능)
- **`src/pages/Account.jsx` — 계정 정보 페이지 생성 (보안 강화)**
  - 진입 시 현재 비밀번호(본인 확인) 요구 로직 추가
  - 본인 확인 성공 시 내 기본 정보(이름, 이메일, 성별 등) 읽기 전용 폼 제공
  - 하단 폼을 통해 새 비밀번호로 직접 변경 가능

### 🚀 개선 및 수정
- **라우팅 구조 개편 (`src/App.jsx`)**
  - `/` 경로를 웰컴 페이지로 분리 및 `/app`을 앱 메인(Layout) 진입점으로 변경
  - `/app/mypage`, `/app/search`, `/app/account` 라우트 연결
- **하단 네비게이션 교체 (`src/components/Layout.jsx`)**
  - 설정(⚙️) 탭을 마이페이지(👤) 탭으로 대체
  - 비로그인 사용자가 마이페이지 클릭 시 `/auth`로 리다이렉트되도록 접근 제어
- **회원가입 폼 전면 확장 (`src/pages/Auth.jsx`, 백엔드 연동)**
  - 한 화면에서 기본 정보(이름, 이메일, 전화번호, 생년월일, 성별)까지 모두 입력받도록 개선
  - 백엔드 `User` 엔티티, `AuthDto`, `AuthService`에 해당 필드 추가 매핑 반영 완료
- **비밀번호 찾기 UX/로직 전면 개선 (`src/pages/Auth.jsx`, 백엔드 연동)**
  - 임시 비밀번호 발급 방식을 폐기하고, 아이디/이메일 검증 후 즉시 **새 비밀번호를 설정(Step 1, 2)**하도록 변경
  - `AuthController.java`, `AuthService.java` 로직 수정 및 신규 DTO(`ResetPasswordRequest`, `VerifyPasswordRequest`, `ChangePasswordRequest` 등) 적용
  - `UserController.java`, `UserService.java` 신규 컨트롤러/서비스 계층 추가 (마이페이지 보안 및 정보 관리 목적)

---

## 📅 [2026-08-24]

### ✨ 신규 기능
- **`src/pages/Auth.jsx` — 로그인/회원가입 페이지 생성**
  - 하나의 화면에서 **로그인 / 회원가입 탭 전환** 방식으로 구현
  - 백엔드 API 연동 (`/api/auth/login`, `/api/auth/signup`)
  - 에러 메시지 하단 렌더링 및 스피너 애니메이션 구현
- **Auth 페이지 스타일 추가 (`src/index.css`)**
  - 입력 필드 글로우 효과 및 로딩 스피너 애니메이션 스타일링

### 🚀 개선 및 수정
- **로그인 시 하단 네비게이션 숨김 처리 (`src/App.jsx`)**
  - `<Layout />` 외부에 `<Auth />` 컴포넌트를 분리 배치하여 인증 화면의 몰입도 향상
