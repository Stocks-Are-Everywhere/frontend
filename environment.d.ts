declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_DB_USERNAME: string; // 데이터베이스 사용자 이름
      REACT_APP_DB_PASSWORD: string; // 데이터베이스 비밀번호
      REACT_APP_DB_HOST: string; // 데이터베이스 호스트
      REACT_APP_DB_PORT: string; // 데이터베이스 포트 (문자열로 처리)
      REACT_APP_DB_NAME: string; // 데이터베이스 이름
      REACT_APP_DB_URL: string; // 데이터베이스 연결 URL
      REACT_APP_BASE_URL: string; // 기본 URL
      REACT_APP_CLIENT_URL: string; // 클라이언트 URL
      REACT_APP_WS_URL: string; // 웹소켓 URL
      REACT_APP_ORDER_API_URL: string; // 주문 API URL
      REACT_APP_USER_API_URL: string; // 유저 API URL
      REACT_APP_USER_SERVICE_PORT: string; // 애플리케이션 포트 (문자열로 처리)
      REACT_APP_ORDER_SERVICE_PORT: string; // 주문 포트
      REACT_APP_KOREAINVEST_CLIENT_ID: string; // 한국투자증권 클라이언트 ID
      REACT_APP_KOREAINVEST_CLIENT_SECRET: string; // 한국투자증권 클라이언트 비밀 키
      REACT_APP_KOREAINVEST_WEBSOCKET_KEY: string; // 한국투자증권 웹소켓 키
      REACT_APP_KOREAINVEST_API_URL: string; // 한국투자증권 API URL
      REACT_APP_JWT_SECRET_KEY: string; // JWT 비밀 키
      REACT_APP_GOOGLE_CLIENT_ID: string; // Google 클라이언트 ID
      REACT_APP_GOOGLE_CLIENT_SECRET: string; // Google 클라이언트 비밀 키
      REACT_APP_GOOGLE_REDIRECT_URI: string; // Google 리디렉션 URI
      REACT_APP_GOOGLE_TOKEN_URI: string; // Google 토큰 URI
      REACT_APP_GOOGLE_USER_INFO: string; // Google 사용자 정보 URL
      REACT_APP_CHROME_EXTENSION_ID: string; // Chrome 확장 프로그램 ID
    }
  }
}

export {};
