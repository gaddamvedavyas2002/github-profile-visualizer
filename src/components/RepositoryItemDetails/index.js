import {Component} from 'react'
import {PieChart, Pie, Cell, Legend, Tooltip} from 'recharts'

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

const pieColors = [
  '#8884d8',
  '#83a6ed',
  '#8dd1e1',
  '#82ca9d',
  '#a4de6c',
  '#d0ed57',
  '#ffc658',
]

class RepositoryItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repositoryDetails: {},
  }

  componentDidMount() {
    const {username} = this.context
    if (username !== '') {
      this.getRepositoryDetails()
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getRepositoryDetails = async () => {
    const {username} = this.context
    const {match} = this.props
    const {params} = match
    const {repoName} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/gpv/specific-repo/${username}/${repoName}`

    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          repositoryDetails: data,
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
    this.getRepositoryDetails()
  }

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
    const {repositoryDetails} = this.state
    const rawLanguages =
      repositoryDetails.lanuages || repositoryDetails.languages || []
    const contributors = repositoryDetails.contributors || []

    let languagesList = []
    if (Array.isArray(rawLanguages)) {
      languagesList = rawLanguages
    } else if (rawLanguages && typeof rawLanguages === 'object') {
      languagesList = Object.entries(rawLanguages).map(([name, value]) => ({
        name,
        value,
      }))
    }

    let contributorsList = []
    if (Array.isArray(contributors)) {
      contributorsList = contributors
    } else if (contributors && typeof contributors === 'object') {
      contributorsList = Object.values(contributors)
    }

    const repoName = repositoryDetails.name || repositoryDetails.title

    return (
      <div className="repo-details-container">
        <h1 className="repo-details-name">{repoName}</h1>
        <p className="repo-details-language">{repositoryDetails.language}</p>
        <p className="repo-details-stars">
          {repositoryDetails.stargazers_count}
        </p>
        <p className="repo-details-forks">{repositoryDetails.forks_count}</p>

        <div className="counts-row">
          <div className="count-item">
            <p className="count-label">Watchers Counts</p>
            <p className="count-value">{repositoryDetails.watchers_count}</p>
          </div>
          <div className="count-item">
            <p className="count-label">Issues Counts</p>
            <p className="count-value">{repositoryDetails.open_issues_count}</p>
          </div>
        </div>

        <h1 className="section-heading">Contributors</h1>
        <ul className="contributors-list">
          {contributorsList.map(contributor => (
            <li
              className="contributor-item"
              key={contributor.id || contributor.login}
            >
              <img
                src={contributor.avatar_url}
                alt="contributor profile"
                className="contributor-avatar"
              />
              <p className="contributor-login">{contributor.login}</p>
            </li>
          ))}
        </ul>

        <h1 className="section-heading">Languages</h1>
        <ul className="languages-list" data-testid="languages-list">
          {languagesList.map(language => (
            <li className="language-item" key={language.name}>
              <p>{language.name}</p>
            </li>
          ))}
        </ul>

        {languagesList.length > 0 && (
          <PieChart width={400} height={350}>
            <Pie
              data={languagesList}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {languagesList.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        )}
      </div>
    )
  }

  renderRepositoryDetailsView = () => {
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
    return (
      <div className="repo-item-details-container">
        <Header />
        <h1 className="repositories-heading">Repositories</h1>
        {this.renderRepositoryDetailsView()}
      </div>
    )
  }
}

RepositoryItemDetails.contextType = GithubContext

export default RepositoryItemDetails
