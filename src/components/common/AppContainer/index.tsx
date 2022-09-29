import React, { ReactNode } from 'react';
import { AppContainerWrapper } from './AppContainer.styled';


interface AppContainerProps {
  children: ReactNode[] | ReactNode;
}

const AppContainer = ({children}: AppContainerProps) => {
  return (
    <AppContainerWrapper>
      {children}
    </AppContainerWrapper>
  )
};


export default AppContainer;
