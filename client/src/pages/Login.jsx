import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const AuthContainer = styled.div`
  max-width: 550px;
  margin: 4rem auto;
  overflow: hidden;
  border: 2px solid #000;
  border-radius: 3em;

  @media (max-width: 768px) {
    margin: 2rem auto;
    width: 90%;
  }
`;

const Header = styled.div`
  background-color: #A3FF32;
  padding: 2rem;
  text-align: center;
  h2 {
    color: #fff;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const Form = styled.form`
  padding: 3rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-family: 'Dela Gothic One', sans-serif;
  border: 2px solid #000;
  border-radius: 3em;
  background: none;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #B374FF;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }
`;

const SubmitButton = styled.button`
  width: 80%;
  padding: 1rem;
  font-size: 1.2rem;
  font-family: 'Dela Gothic One', sans-serif;
  background-color: #B374FF;
  color: #fff;
  border: none;
  border-radius: 3em;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BottomLink = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  
  a {
    font-weight: bold;
    color: #000;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  text-align: center;
  margin-bottom: 1rem;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <AuthContainer>
      <Header>
        <h2>Вход</h2>
      </Header>
      <Form onSubmit={onSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <label htmlFor="email">email</label>
          <Input type="email" name="email" value={email} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="password">пароль</label>
          <Input type="password" name="password" value={password} onChange={onChange} required />
        </FormGroup>
        <SubmitButton type="submit">Войти</SubmitButton>
        <BottomLink>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </BottomLink>
      </Form>
    </AuthContainer>
  );
};

export default Login;
