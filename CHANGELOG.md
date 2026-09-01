# Changelog

이 파일은 프로젝트의 주요 변경 사항을 날짜와 시각별로 기록합니다.
수정 후 원복한 경우, 그 이유도 함께 기재합니다.

---

## 📅 [2026-09-01]

🕒 **16:55**

### ✨ 신규 기능
- **투자 성향 테스트 및 맞춤형 전략 추천 기능 추가**
  - **이유(Why)**: 초보 투자자나 본인에게 맞는 전략을 선택하기 어려워하는 사용자들을 위해, 간단한 문답을 통해 가장 적합한 매매 전략을 자동으로 추천하고 설정해주는 편의 기능을 제공하기 위함.
  - `src/pages/Survey.jsx`: 4개의 객관식 질문으로 구성된 설문조사 UI 및 점수 산출 로직 구현. 완료 시 백엔드(`/api/preference/mode`) API를 호출하여 해당 전략으로 즉시 설정.
  - `src/pages/Trade.jsx`: 매매 전략 설정 페이지 상단에 사용자가 원할 때 언제든 설문을 진행할 수 있는 '💡 나만의 투자 성향 테스트하기' 배너 UI 추가.
  - `src/App.jsx`: `/app/survey` 라우팅 등록.
- **종목 상세 페이지(`StockDetail.jsx`) 구현 및 네비게이션 연동**
  - **이유(Why)**: 사용자가 검색된 종목을 클릭하거나 검색창에서 엔터를 쳤을 때, 즉시 해당 종목의 상세 시세와 차트를 볼 수 있도록 탐색(Navigation) 경험을 향상시키기 위함.
  - `StockDetail.jsx` 신규 생성: 백엔드 API를 호출하여 현재가, 등락률, 상장연도 및 5개월 일봉 차트(Recharts 활용) 렌더링.
  - `App.jsx`: `/app/stock/:code` 라우트 추가.
  - `Search.jsx`: 검색 결과 클릭 및 폼 제출(Enter) 시 해당 종목의 상세 페이지로 즉시 이동(`useNavigate`)하도록 이벤트 핸들러 리팩토링.
- **종목 검색 실시간 자동완성(Autocomplete) 기능 추가**
  - `Search.jsx`: 검색어 입력 시 하단에 드롭다운 형태로 검색 결과를 표시하는 기능 구현.
  - 타자를 칠 때마다 발생하는 과도한 API 호출(서버 부하)을 방지하기 위해 300ms 딜레이의 **디바운스(Debounce)** 처리를 적용하여 서버 요청을 최적화.
  - 종목 초성 검색 기능과 연동되어 "ㅎ"만 입력해도 "현대차", "한화" 등 관련 종목 리스트가 즉시 노출되도록 UI 개선.
- **매매 전략 상세 설명 페이지(`TradeDetail.jsx`) 추가**
  - 비로그인 사용자가 '자동매매' 탭에서 전략(공격투자형 등)을 클릭 시, 설정 변경 대신 해당 전략에 대한 자세한 설명과 특징을 볼 수 있는 신규 상세 페이지(`/app/trade/detail/:mode`)로 이동하도록 라우팅 추가.
  - 로그인된 사용자가 토큰 만료 등의 사유로 401 에러를 겪는 경우의 알림창 로직은 기존대로 유지.

---

## 📅 [2026-08-26]

### ✨ 신규 기능
- **OAuth 2.0 연동 (Kakao, Naver, Google)**
  - `src/pages/Auth.jsx`: 카카오, 네이버, 구글 소셜 로그인 버튼 및 백엔드 인가 URL로의 리다이렉션 추가
  - `src/pages/OAuth2RedirectHandler.jsx`: 소셜 로그인 성공 시 백엔드로부터 전달받은 JWT 토큰을 로컬 스토리지에 저장하고 앱 메인 화면으로 이동시키는 핸들러 컴포넌트 추가
  - `src/App.jsx`: `/oauth2/redirect` 라우트 등록
- **성과 대시보드 (Performance Report) 시각화 및 라우팅 추가**
  - `recharts` 라이브러리 도입
  - `src/components/PerformanceChart.jsx`: 1D, 1W, 1M 기간 토글을 지원하는 AreaChart(수익률 추이) 컴포넌트 구현
  - `src/pages/Performance.jsx`: 최대 낙폭(MDD), 승률(Win Rate), 최근 거래 내역 등을 포함한 상세 성과 리포트 페이지 신규 생성 및 로그인 유저 전용 라우트 가드(`Navigate`) 적용
  - `src/pages/Dashboard.jsx`: 홈페이지 내 '내 보유종목' 상단에 수익률 추이 요약(미니 스파크라인 차트) 카드 추가. 
  - `src/pages/Dashboard.jsx`: **비로그인 시 대시보드 뷰 변경** - 자산, 스케줄러, 보유 종목 정보를 숨기고, 대신 '매매전략별 평균 수익률' 바 차트(BarChart)와 로그인 유도 버튼을 노출하도록 분기 처리
  - `src/App.jsx`: `/app/performance` 라우트 등록

- **계좌 잔고(`Balance.jsx`) 및 거래 내역(`History.jsx`) 신규 추가**
  - `src/pages/Balance.jsx`: 예수금, 총 자산 등 자산 요약과 Recharts `PieChart`를 활용한 포트폴리오 비중 시각화 및 보유 종목 상세 내역 뷰 생성
  - `src/pages/History.jsx`: 매수/매도 필터링 기능을 갖춘 기간별 체결 내역 리스트 뷰 생성 (실현 손익 등 포함)
  - `src/App.jsx`: `/app/balance`, `/app/history` 신규 라우트 등록
  - 기존 페이지(`Dashboard.jsx`, `MyPage.jsx`, `Performance.jsx`)에 신규 페이지로 연결되는 진입점(더보기, 카드 클릭 이벤트 등) 연동 추가
  - **로그인 유무 방어**: 두 페이지 모두 비로그인 진입 시 아이콘 및 로그인 안내 텍스트 노출 처리
  - `src/pages/Search.jsx`: 기존 하드코딩된 Mock 데이터(`HOT_STOCKS`)를 제거하고, 백엔드의 `/api/stocks/popular` (한국투자증권 연동) API를 호출하여 실제 거래량 상위 종목을 렌더링하도록 수정
  - **API 응답 데이터 부재 시 예외 처리**: KIS API 키 미설정 등으로 인해 빈 응답(`[]`) 수신 시 `catch` 블록으로 이동하여 다시 로컬 더미 데이터(`HOT_STOCKS`)를 표시하도록 방어 로직 추가.

### ♻️ 리팩토링 및 버그 수정
- **프론트엔드 인증 로직 전면 개편 (HttpOnly 쿠키 방식 도입)**
  - `src/contexts/AuthContext.jsx`: 앱 구동 시 `/api/user/me`를 호출하여 쿠키 기반 전역 인증 상태를 관리하는 `AuthProvider` 도입 (axios `withCredentials = true` 일괄 적용)
  - `src/App.jsx`: 최상단 컴포넌트에 `AuthProvider` 래핑
  - `src/pages/Auth.jsx`, `src/pages/MyPage.jsx`, `src/pages/Account.jsx`: `localStorage`에 의존하던 JWT 토큰 발급 및 사용 코드를 모두 제거하고 `useAuth` 훅으로 상태 조회 및 백엔드 로그아웃 통신으로 일원화
  - `src/pages/Auth.jsx`: 백엔드의 '회원가입 시 자동 로그인 처리' 변경에 맞춰, 프론트엔드에서도 가입 성공 후 즉시 `checkAuth()`를 호출해 전역 유저 정보를 갱신하고 대시보드(`/app`)로 이동하도록 수정
  - `src/contexts/AuthContext.jsx`: 비정상적인 인증 시나리오에서 백엔드가 HTML(기본 로그인 페이지)을 반환할 때 이를 사용자 정보로 착각하여 렌더링 에러가 발생하는 현상 방어(HTML 포함 시 `user` = `null` 처리)
  - `src/pages/Auth.jsx`: 로그인/비밀번호 찾기 시 백엔드 에러 응답 객체(JSON)가 직접 에러 상태로 들어가 React 렌더링 에러를 유발하지 않도록 문자열 방어 처리 추가
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
