import React from 'react'
import { useInstance } from 'react-ioc'
import { observer } from 'mobx-react'
import TicketService from '../services/ticket'
import Panel from '../components/panel'
import Field from '../components/field'
import testImg from '../icons/test.svg'

const TicketList = () => {
  const ticketService = useInstance(TicketService);

  return (
    <>
      {
        ticketService.ticketList.map(ticket => {
          return (
            <Panel key={ticket.id}>
              <div className="ticket">
                <div className="row">
                  <div className="price">
                    13 500 P
                  </div>
                  <div className="image">
                    <img src={testImg}/>
                  </div>
                </div>
                <div className="ticket-list">
                  <div className="row ticket-row">
                    <div>
                      <Field label={"MOW - HKT"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                    <div>
                      <Field label={"В пути"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                    <div>
                      <Field label={"2 пересадки"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                  </div>
                  <div className="row ticket-row">
                    <div>
                      <Field label={"MOW - HKT"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                    <div>
                      <Field label={"В пути"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                    <div>
                      <Field label={"2 пересадки"}>
                        10:45 – 08:00
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )
        })
      }
      
      <style jsx>{`

        .ticket {
          padding: 20px;
          margin-top: 20px;
          box-sizing: border-box;
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          margin-left: -5px;
          margin-right: -5px;
          margin-top: -5px;
          flex-wrap: wrap;
        }

        .ticket-row {
          margin-top: 5px;
        }

        .ticket-list {
          padding-top: 10px;
        }

        .row > * {
          flex: 1 0 0;
          padding-left: 5px;
          padding-right: 5px;
          padding-top: 5px;
          white-space: nowrap;
        }

        .price {
          font-style: normal;
          font-weight: 600;
          font-size: 24px;
          line-height: 24px;
          color: #2196F3;
        }

        .image {
          text-align: right;
        }

        .image > img {
          margin-right: 30px;
        }
      `}</style>
    </>
  )
}

export default observer(TicketList)
