import WS from 'jest-websocket-mock';

const MOCK_WS_URL = 'ws://localhost:31000';
const server = new WS(MOCK_WS_URL);

server.on('connection', (socket: any) => {
  console.log('=== Mock KIS WebSocket Server Connected ===');

  socket.on('message', (message: string) => {
    try {
      const request = JSON.parse(message);
      const { body } = request;

      // 1. 초기 연결 응답 전송 (실제 KIS와 동일한 응답 형식)
      socket.send(
        JSON.stringify({
          header: {
            tr_id: 'H0STCNT0',
            tr_key: body.input.tr_key,
            encrypt: 'N',
          },
          body: {
            rt_cd: '0',
            msg_cd: 'OPSP0000',
            msg1: 'SUBSCRIBE SUCCESS',
            output: {
              iv: '0123456789abcdef',
              key: 'abcdefghijklmnop',
            },
          },
        })
      );

      // 2. 실시간 데이터 전송 (1초마다 44개 필드를 전송)
      setInterval(() => {
        const now = new Date();
        // 시간은 HHMMSS 형식 (예: "171909")
        const timeStr =
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') +
          String(now.getSeconds()).padStart(2, '0');

        // 공식 문서에 따른 44개 필드 구성 (필드 순서와 개수를 정확히 맞춤)
        const fields = [
          '005930', // 유가증권 단축 종목코드
          timeStr, // 주식 체결 시간 (HHMMSS)
          '71900', // 주식 현재가
          '5', // 전일 대비 부호
          '-100', // 전일 대비
          '-0.14', // 전일 대비율
          '72023.83', // 가중 평균 주식 가격
          '72100', // 주식 시가
          '72400', // 주식 최고가
          '71700', // 주식 최저가
          '71900', // 매도호가1
          '71800', // 매수호가1
          '1', // 체결 거래량
          '3052507', // 누적 거래량
          '219853241700', // 누적 거래 대금
          '5105', // 매도 체결 건수
          '6937', // 매수 체결 건수
          '1832', // 순매수 체결 건수
          '84.90', // 체결 강도
          '1366314', // 총 매도 수량
          '1159996', // 총 매수 수량
          '1', // 체결 구분
          '0.39', // 매수 비율
          '20.28', // 전일 거래량 대비 등락율
          '090020', // 시가 시간
          '5', // 시가 대비 구분
          '-200', // 시가 대비
          '090820', // 고가 시간
          '5', // 고가 대비 구분
          '-500', // 고가 대비
          '092619', // 저가 시간
          '2', // 저가 대비 구분
          '200', // 저가 대비
          '20230612', // 영업일자
          '20', // 신 장운영 구분 코드 (첫번째 비트)
          'N', // 거래 정지 여부
          '65945', // 매도 호가 잔량1
          '216924', // 매수 호가 잔량1
          '1118750', // 총 매도 호가 잔량
          '2199206', // 총 매수 호가 잔량
          '0.05', // 거래량 회전율
          '2424142', // 전일 동시간 누적 거래량
          '125.92', // 전일 동시간 누적 거래량 비율
          '0', // 시간 구분 코드
          '', // 임의 종료 구분 코드 (빈값 허용)
          '72100', // 정적 VI 발동 기준가
        ];

        // 최종 전송 형식: "암호화여부|TR_ID|데이터건수|필드1^필드2^...^필드44"
        const packet = `0|H0STCNT0|001|${fields.join('^')}`;
        socket.send(packet);
      }, 1000);
    } catch (error) {
      console.error('처리 실패:', error);
    }
  });
});

console.log(`=== Mock KIS WebSocket Server running at ${MOCK_WS_URL} ===`);

export { server };
