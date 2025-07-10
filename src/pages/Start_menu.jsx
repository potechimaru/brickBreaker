import React from 'react'
import title from "../image/title.png";
import '../scss/start/start.css';
import { Link } from 'react-router-dom'; 

const Start_menu = () => {
  return (
    <div className="App">
        <img src={title} alt="title" className="title"/>
        <div className = "start">
            <ul className = "menu">
                <Link to="/content">
                    <li className = "item">スタート</li>
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Start_menu
