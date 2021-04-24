import React from 'react'
import { NavLink } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <br/>
            <li>
                <NavLink to="/SignUp">Login Page</NavLink>
            </li>
            <li>
                <NavLink to="/profile">Profile Page</NavLink>
            </li>
            <li>
                <NavLink to="/create">Create Forum</NavLink>
            </li>
            <li>
                <NavLink to="/subject">Subject Page</NavLink>
            </li>
        </div>
    )
}

export default Home


