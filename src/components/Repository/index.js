import {Component} from 'react'
import {Link} from 'react-router-dom'

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

class Repository extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repositoriesList: [],
  }

  componentDidMount() {
    const {username} = this.context
    if (username !== '') {
      this.getRepositories()
    }
  }

  getRepositories = async () => {
    const {username} = this.context
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/gpv/repos/${username}`

    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          repositoriesList: data,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickTryAgain = () => {
    this.getRepositories()
  }

  renderEmptyUsernameView = () => (
    <div className="no-data-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-data-found-img.png"
        alt="empty repositories"
        className="no-data-image"
      />
      <h1 className="no-data-heading">No Data Found</h1>
      <p className="no-data-text">
        GitHub username is empty, please provide a valid username for
        Repositories
      </p>
      <Link to="/">
        <button type="button" className="go-home-button">
          Go to Home
        </button>
      </Link>
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

  renderNoRepositoriesView = () => (
    <div className="no-repos-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-repositories-img.png"
        alt="no repositories"
        className="no-repos-image"
      />
      <h1 className="no-repos-heading">No Repositories Found</h1>
    </div>
  )

  renderSuccessView = () => {
    const {repositoriesList} = this.state

    if (repositoriesList.length === 0) {
      return this.renderNoRepositoriesView()
    }

    return (
      <ul className="repositories-list">
        {repositoriesList.map(repo => {
          const repoTitle = repo.title || repo.name

          return (
            <li className="repo-item" data-testid="repoItem" key={repo.id}>
              <Link to={`/repositories/${repoTitle}`} className="repo-link">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="repo-owner-avatar"
                />
                <h1 className="repo-owner-login">{repo.owner.login}</h1>
                <p className="repo-name">{repoTitle}</p>
                <p className="repo-language">{repo.language}</p>
                <p className="repo-stars">{repo.stargazers_count}</p>
                <p className="repo-forks">{repo.forks_count}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  renderRepositoriesView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loader />
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {username} = this.context

    return (
      <div className="repository-container">
        <Header />
        <h1 className="repository-heading">Repositories</h1>
        {username === ''
          ? this.renderEmptyUsernameView()
          : this.renderRepositoriesView()}
      </div>
    )
  }
}

Repository.contextType = GithubContext

export default Repository
