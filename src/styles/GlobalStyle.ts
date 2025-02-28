import { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #f5f6f7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; // 가로 스크롤 방지
  }
  
  * {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

`;
