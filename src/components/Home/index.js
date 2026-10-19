import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {RiBuildingLine} from 'react-icons/ri'
import {IoMdLink} from 'react-icons/io'
import {IoLocationOutline} from 'react-icons/io5'

import Header from '../Header'
import Loader from '../Loader'
import GithubContext from '../../context/GithubContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const API_KEY = '289234723783_38'

class Home extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    profileData: {},
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getProfileDetails = async () => {
    const {searchInput} = this.state
    const {updateUsername} = this.context

    // Share the searched username with the other routes via context.
    updateUsername(searchInput)
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/gpv/profile-details/${searchInput}`

    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          profileData: data,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearch = () => {
    const {searchInput} = this.state
    if (searchInput.trim() !== '') {
      this.getProfileDetails()
    }
  }

  onClickTryAgain = () => {
    this.getProfileDetails()
  }

  renderInitialView = () => (
    <div className="home-initial-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/github-profile-visualizer-home-lg-output.png"
        alt="github profile visualizer home page"
        className="home-image"
      />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profileData} = this.state

    return (
      <div className="profile-container">
        <img
          src={profileData.avatar_url}
          alt={profileData.name}
          className="profile-avatar"
        />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-login">{profileData.login}</p>

        <p className="profile-bio-label">BIO</p>
        <p className="profile-bio">{profileData.bio}</p>

        <div className="profile-stats">
          <div className="stat-item">
            <p className="stat-label">FOLLOWERS</p>
            <p className="stat-value">{profileData.followers}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">FOLLOWING</p>
            <p className="stat-value">{profileData.following}</p>
          </div>
          <div className="stat-item">
            <p className="stat-label">PUBLIC REPOS</p>
            <p className="stat-value">{profileData.public_repos}</p>
          </div>
        </div>

        <ul className="profile-details-list">
          <li className="detail-item">
            <RiBuildingLine className="detail-icon" />
            <p className="detail-label">Company</p>
            <p className="detail-value">{profileData.company}</p>
          </li>
          <li className="detail-item">
            <IoMdLink className="detail-icon" />
            <p className="detail-label">Blog</p>
            <p className="detail-value">{profileData.blog}</p>
          </li>
          <li className="detail-item">
            <IoLocationOutline className="detail-icon" />
            <p className="detail-label">Location</p>
            <p className="detail-value">{profileData.location}</p>
          </li>
        </ul>
      </div>
    )
  }

  renderProfileView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loader />
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderInitialView()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="home-container">
        <Header />
        <div className="search-container">
          <input
            type="search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            placeholder="Enter GitHub Username"
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-button"
            onClick={this.onClickSearch}
          >
            <HiOutlineSearch className="search-icon" />
          </button>
        </div>
        {this.renderProfileView()}
      </div>
    )
  }
}

Home.contextType = GithubContext

export default Home
