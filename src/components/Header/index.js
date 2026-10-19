import {Link} from 'react-router-dom'

import './index.css'

const Header = () => (
  <nav className="header">
    <div className="header-content">
      <Link to="/" className="header-title-link">
        <h1 className="header-heading">GitHub Profile Visualizer</h1>
      </Link>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/repositories" className="nav-link">
            Repositories
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/analysis" className="nav-link">
            Analysis
          </Link>
        </li>
      </ul>
    </div>
  </nav>
)

export default Header
