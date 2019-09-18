import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketListLoading from '../components/ticket-list-loading'
import Ticket from '../components/ticket'
import TicketService from '../services/ticket.service'

const TicketList = () => {
  const ticketService = useInstance(TicketService);

  return (
    <>
      {
        ticketService.loading
          ? <TicketListLoading/>
          : ticketService.aggregatedTicketList.length
            ? ticketService.aggregatedTicketList.map(
              (ticket, index) => <Ticket key={index} ticket={ticket} isLoading={ticketService.handling}/>,
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
