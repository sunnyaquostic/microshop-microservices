import React from 'react'

function Navbar() {
  return (
    <>
        <div className="nav-container">
            <ul className='nav-items'>
                <li>Home</li>
                <li>Products</li>
                <li>Category</li>
                <li>Cart</li>
                <li>
                    Profile
                    <ul className='nav-inner-nav-items'>
                        <li>Dashboard</li>
                        <li>Settings</li>
                        <li>Logout</li>
                    </ul>
                </li>
                <li>Login</li>
                <li>Register</li>
            </ul>
        </div>
        
    </>
  )
}

export default Navbar