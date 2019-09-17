import React from 'react'
import LogoIcon from '../icons/logo.svg'
import TicketFilteredService from '../services/ticket_filtered';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react';

const Nav = () => {
  const ticketFilteredService = useInstance(TicketFilteredService);

  return (
    <nav>
      <div className="navbar">
        <img src={LogoIcon} className={
          ticketFilteredService.loading || ticketFilteredService.handling ? 'is-flickering' : ''
        }/>
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-around;
          flex-direction: row;
          height: 160px;
          align-items: center;
        }

        @keyframes flickerAnimation {
          0%   {
            opacity: 1;
          }
          50%  {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }

        .is-flickering {
          opacity: 1;
          animation: flickerAnimation 1s infinite;
        }
      `}</style>
    </nav>
  );
}

export default observer(Nav)
