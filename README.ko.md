# Fragmetric F Point Checker

![Fragmetric](public/logo.png)

이 프로젝트는 Fragmetric의 공개 API를 활용하여 F Point 적립 현황을 실시간으로 확인할 수 있는 대시보드입니다.

## 주요 기능

- Fragmetric API를 활용한 실시간 F Point 적립 현황 확인
- DeFi 풀 별 F Point 적립 상세 정보
- F Point 순위 및 통계 정보
- Recharts를 활용한 적립률 시각화
- 사용자 지정 풀 주소 입력 기능이 있는 DeFi 풀 F Point 추적

## Fragmetric API 활용

이 프로젝트는 다음 Fragmetric API 엔드포인트를 활용합니다:

1. **유저 F Point 적립 정보**: `/v1/public/fpoint/user/{user_public_key}`
   - 유저의 전체 F Point 적립 예측 정보 제공
   - 기본 적립, 추천 적립, 순위 정보 등 포함

2. **DeFi 풀 F Point 적립 정보**: `/v1/public/fpoint/defi/{user_public_key}`
   - 특정 DeFi 풀에서의 F Point 적립 예측 정보 제공
   - 특정 풀 주소로 필터링 가능

3. **DeFi 풀 래핑된 토큰 정보**: `/v1/public/wrapped-token-amount/{defi_pool_address}`
   - 특정 DeFi 풀에 락업된 래핑된 토큰 총량 정보 제공

## 실시간 계산

Fragmetric API는 다음 형식으로 F Point 정보를 제공합니다:
```
accrualAmount + accrualAmountPerSeconds * (NOW() - estimatedAt in seconds)) / 10000
```

이 프로젝트는 위 공식을 활용하여 실시간으로 F Point 적립량을 계산하고 표시합니다.

## 기술 스택

- **프레임워크**: Next.js
- **스타일링**: Tailwind CSS, shadcn/ui
- **차트**: Recharts를 활용한 시각화
- **상태 관리**: React Query, Zustand
- **지갑 통합**: Solana Wallet Adapter
- **TypeScript**
- **Solana Web3.js**

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드된 애플리케이션 실행
npm run start
```

## 환경 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```
NEXT_PUBLIC_FRAGMETRIC_API_URL=https://api.fragmetric.xyz/v1
```

## 프로젝트 구조

```
src/
├── components/  
│   ├── fpoint/  # F Point 관련 컴포넌트
│   ├── layout/  # 레이아웃 컴포넌트
│   └── ui/      # shadcn UI 컴포넌트
├── lib/         
│   ├── api/     # API 클라이언트
│   ├── store/   # 상태 관리
│   └── utils/   # 유틸리티 함수
├── pages/       # Next.js 페이지
└── styles/      # 전역 스타일
```

## 라이센스

[MIT](LICENSE)
