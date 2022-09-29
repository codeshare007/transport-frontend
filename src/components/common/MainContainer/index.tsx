import React, { ReactNode } from 'react';
import { MainContainerWrapper } from './MainContainer.styled';


interface MainContainerProps {
  children: ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <MainContainerWrapper>
      {children}
    </MainContainerWrapper>
  )
};

export default MainContainer;
