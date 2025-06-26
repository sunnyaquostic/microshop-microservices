import React from 'react'

function Header() {
  return (
    <div className='header '>
      <a href="/" className='header-right-container'>
        <img src="logo.png" alt=''  className='header-logo'/>
        <h2 className='header-title'>MyCOmpany</h2>
      </a>

      <small className='header-text'>simple e-commerce store</small>
    </div>
  )
}

export default Header