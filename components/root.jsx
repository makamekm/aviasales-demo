import React from 'react'
import Head from 'next/head'
import { provider } from 'react-ioc'
import FilterService from '../services/filter.service'
import TicketProvider from '../services/ticket.service'
import TicketService from '../services/ticket.service'

const Root = ({children}) => {
  return (
    <>
      <Head>
        <title>Aviasales Demo</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap" rel="stylesheet"></link>
      </Head>

      {children}
      
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif;
          background-color: #F3F7FA;
          color: #4A4A4A;
        }
      `}</style>
    </>
  )
}

export default provider(
  FilterService,
  TicketProvider,
  TicketService,
)(Root)
