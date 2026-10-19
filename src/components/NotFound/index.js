import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <Header />
    <div className="not-found-content">
      <img
        src="https://assets.ccbp.in/frontend/react-js/page-not-found-img.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="not-found-heading">PAGE NOT FOUND</h1>
      <p className="not-found-text">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <Link to="/">
        <button type="button" className="go-home-button">
          Go to Home
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
