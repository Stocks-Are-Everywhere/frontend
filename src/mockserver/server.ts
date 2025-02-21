import WS from 'jest-websocket-mock';

const MOCK_WS_URL = 'ws://localhost:31000';
const server = new WS(MOCK_WS_URL);

server.on('connection', (socket: any) => {
  console.log('=== Mock 서버 연결 성공 ===');

  socket.on('message', (message: string) => {
    try {
      const { body } = JSON.parse(message);

      // 1. 초기 응답
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

      // 2. 실시간 데이터 전송
      setInterval(() => {
        // 모든 숫자를 문자열로 변환하여 처리
        const fields = [
          '005930', // 종목코드
          '091300', // 시간 (고정값)
          '57600', // 현재가
          '5', // 체결수량
          '-800', // 대비
          (-1.37).toFixed(2), // 등락률
          '57861.28', // 가중평균
          '58400', // 매도호가
          '58500', // 상한가
          '57500', // 하한가
          '57700', // 시가
          '57600', // 종가
          '1440', // 거래량
          '2956893', // 거래대금
          '171091825900', // 누적거래대금
          '6609', // 매도잔량
          '5245', // 매수잔량
          '-1364', // 순매수잔량
          '25.06', // 거래량회전율
          '2046091', // 전일거래량
          '512819', // 전일거래대금
          '5', // 체결강도
          '0.18', // 체결강도율
          '13.70', // PER
          '090014', // 체결시각
          '5', // 수량
          '-800', // 대비
          '090014', // 시각
          '5', // 수량
          '-900', // 대비
          '090153', // 시각
          '2', // 수량
          '100', // 대비
          '20250221', // 일자
          '20', // 장구분
          'N', // 장종료구분
          '227151', // 매도호가잔량
          '58273', // 매수호가
          '740652', // 매도호가건수
          '1820719', // 매수호가건수
          '0.05', // 체결강도율2
          '4908055', // 거래대금회전율
          '60.25', // 시가총액
          '0', // 업종코드
          '', // 업종명
          '58400', // 세션값
        ];

        const packet = `0|H0STCNT0|001|${fields.join('^')}`;
        socket.send(packet);
      }, 1000);
    } catch (error) {
      console.error('처리 실패:', error);
      socket.close(1007, '데이터 형식 오류'); // 오류 시 연결 종료[4]
    }
  });
});

console.log(`=== Mock KIS WebSocket Server running at ${MOCK_WS_URL} ===`);

export { server };
