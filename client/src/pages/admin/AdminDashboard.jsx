import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f4f7f6;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2.5rem;
    color: #333;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 3em;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    margin-bottom: 2rem;
    color: #666;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: #B374FF;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 3em;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Header>
        <h2>Панель управления администратора</h2>
      </Header>
      
      <CardContainer>
        <Card>
          <h3>Управление калькуляторами</h3>
          <p>Добавление, редактирование и удаление калькуляторов</p>
          <StyledLink to="/admin/calculators">
            Управление калькуляторами
          </StyledLink>
        </Card>
      </CardContainer>
      
      {/* <div className="admin-section">
        <h3>Быстрые действия</h3>
        <div className="admin-actions">
          <Link to="/admin/calculators/new" className="btn btn-primary">
            Добавить новый калькулятор
          </Link>
        </div>
      </div> */}
    </DashboardContainer>
  );
};

export default AdminDashboard;
