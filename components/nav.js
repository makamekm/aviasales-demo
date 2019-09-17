import React from 'react'
import LogoIcon from '../icons/logo.svg'

const Nav = () => (
  <nav>
    <div className="navbar">
      <img src={LogoIcon}/>
    </div>

    <style jsx>{`
      .navbar {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        height: 160px;
        align-items: center;
      }
    `}</style>
  </nav>
)

export default Nav
