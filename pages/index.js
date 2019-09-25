import React from 'react';
import Head from 'next/head';
import Navbar from '../components/nav';
import Panel from '../components/panel';
import Layout from '../components/layout';
import Filter from '../components/filter';
import ToggleType from '../components/toggle-type';
import TicketList from '../components/ticket-list';

import { provider } from 'react-ioc';
import compose from '../utils/compose';
import TicketService from '../services/ticket.service';
import FilterService from '../services/filter.service';
import TicketProvider from '../services/ticket.service';
import { QueryParamsProvider } from '../utils/query-params-context';

const enhance = compose(provider(FilterService, TicketProvider, TicketService));

const Page = enhance(({ query }) => {
  return (
    <>
      <QueryParamsProvider value={query}>
        <Head>
          <title>Aviasales Demo</title>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <Navbar />
        <Layout>
          <Panel className="filter-block">
            <Filter />
          </Panel>
          <div className="ticket-list-block">
            <ToggleType />
            <TicketList />
          </div>
        </Layout>
        <style jsx global>{`
          body {
            margin: 0;
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont,
              Helvetica, sans-serif;
            background-color: #f3f7fa;
            color: #4a4a4a;
          }
        `}</style>
        <style jsx>{`
          .filter-block {
            width: 232px;
          }
          .ticket-list-block {
            width: 504px;
          }
          @media (max-width: 766px) {
            .filter-block,
            .ticket-list-block {
              width: 100%;
            }
          }
        `}</style>
      </QueryParamsProvider>
    </>
  );
});

Page.getInitialProps = ({ query }) => {
  return {
    query: query || {}
  };
};

export default Page;
