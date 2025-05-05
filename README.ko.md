# Fragmetric F Point Checker

대시보드 형태로 Fragmetric F Point 정보를 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **대시보드 개요**: 총 F Point, 사용자 수, 포인트 출처 분포 확인
- **개인 통계**: 개인 F Point, 부스트 정보, 일일 활동 차트, GitHub 스타일 기여 그래프
- **리더보드**: 최고 F Point 보유자 순위 확인
- **지갑 연결**: Solana 지갑 연결 지원

## 기술 스택

- **프레임워크**: Next.js
- **스타일링**: Tailwind CSS, shadcn/ui
- **차트**: Recharts (shadcn/ui 차트 컴포넌트)
- **상태 관리**: React Query, Zustand
- **지갑 통합**: Solana Wallet Adapter

## 설치 방법

```bash
# 저장소 클론
git clone https://github.com/yourusername/fragmetric-fpoint-checker.git
cd fragmetric-fpoint-checker

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 실행
npm run lint

# 코드 포맷팅
npm run format

# 포맷팅 문제 확인
npm run format:check
```

## 프로젝트 구조

```
src/
├── components/        # UI 및 레이아웃 컴포넌트
├── lib/               # 유틸리티, API 클라이언트, 스토어
├── pages/             # 라우트 및 페이지 컴포넌트
└── styles/            # 글로벌 스타일 (Tailwind 구성)
```

## 테마 및 색상

- **Primary**: hsl(173, 90%, 44%)
- **Secondary**: hsl(272, 79%, 76%)
- **Accent**: hsl(191, 94%, 45%)

다크 모드를 지원하며, 색상 테마는 `src/styles/globals.css`에서 관리됩니다.
