import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketService from '../services/ticket'
import Panel from '../components/panel'
import Field from '../components/field'
import TicketListLoading from '../components/ticket-list-loading'
import testImg from '../icons/test.svg'
import Ticket from '../components/ticket'
import TicketFilteredService from '../services/ticket_filtered'

const TicketList = () => {
  const ticketService = useInstance(TicketService);
  const ticketFilteredService = useInstance(TicketFilteredService);

  return (
    <>
      {
        ticketService.loading
          ? <TicketListLoading/>
          : ticketService.ticketList.map(
            (ticket, index) => <Ticket key={index} ticket={ticket}/>,
          )
      }
    </>
  )
}

export default observer(TicketList)
