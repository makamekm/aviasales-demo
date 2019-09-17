import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketListLoading from '../components/ticket-list-loading'
import Ticket from '../components/ticket'
import TicketFilteredService from '../services/ticket_filtered'

const TicketList = () => {
  const ticketFilteredService = useInstance(TicketFilteredService);

  return (
    <>
      {
        ticketFilteredService.loading
          ? <TicketListLoading/>
          : ticketFilteredService.aggregatedTicketList.length
            ? ticketFilteredService.aggregatedTicketList.map(
              (ticket, index) => <Ticket key={index} ticket={ticket}/>,
            )
            : <div className="no-ticket-found">
              Билеты не найдены
            </div>
      }
      
      <style jsx>{`
        .no-ticket-found {
          text-transform: uppercase;
          width: 100%;
          text-align: center;
          padding: 20px;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

export default observer(TicketList)
