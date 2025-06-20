import { createGlobalStyle } from 'styled-components';
import fontsCss from './fonts.css';

const GlobalStyle = createGlobalStyle`
  ${fontsCss}

  :root {
    --primary-color: #B374FF;
    --secondary-color: #A3FF32;
    --text-color: #000;
    --light-color: #fff;
    --dark-color: #333;
    --danger-color: #ef4444;
    --success-color: #22c55e;
    --border-color: #e2e8f0;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Dela Gothic One', 'Roboto', 'Arial', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Стили для форм и кнопок, которые используются в разных местах */
  .form-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
  }

  .form-title {
    margin-bottom: 1.5rem;
    color: #000;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }
`;

export default GlobalStyle; 