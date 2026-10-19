import {Component} from 'react'
import {Link} from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

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

const convertToChartData = obj =>
  Object.entries(obj || {}).map(([key, value]) => ({name: key, value}))

class Analysis extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    analysisData: {},
  }

  componentDidMount() {
    const {username} = this.context
    if (username !== '') {
      this.getAnalysisDetails()
    }
  }

  getAnalysisDetails = async () => {
    const {username} = this.context
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/gpv/profile-summary/${username}`

    try {
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          analysisData: data,
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
    this.getAnalysisDetails()
  }

  renderEmptyUsernameView = () => (
    <div className="no-data-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-data-found-img.png"
        alt="empty analysis"
        className="no-data-image"
      />
      <h1 className="no-data-heading">No Data Found</h1>
      <p className="no-data-text">
        GitHub username is empty, please provide a valid username for Analysis
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

  renderPieChart = (title, data) => (
    <div className="chart-block" data-testid="pie-chart">
      <h1 className="chart-heading">{title}</h1>
      <PieChart width={360} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </div>
  )

  renderSuccessView = () => {
    const {analysisData} = this.state
    const {
      user,
      quarterCommitCount,
      langRepoCount,
      langCommitCount,
      repoCommitCount,
    } = analysisData

    const quarterData = Object.entries(quarterCommitCount || {}).map(
      ([quarter, count]) => ({
        quarter,
        count,
      }),
    )
    const langRepoData = convertToChartData(langRepoCount)
    const langCommitData = convertToChartData(langCommitCount)

    const top10RepoCommit = Object.entries(repoCommitCount || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({name, value}))

    return (
      <div className="analysis-content">
        <img
          src={user.avatarUrl}
          alt={user.login}
          className="analysis-avatar"
        />
        <h1 className="analysis-user-login">{user.login}</h1>
        <h1 className="analysis-heading">Analysis</h1>

        {this.renderPieChart('Language Per Repos', langRepoData)}
        {this.renderPieChart('Language Per Commits', langCommitData)}
        <h1 className="chart-heading">Commits Per Repo</h1>
        {this.renderPieChart('Commits Per Repo (Top 10)', top10RepoCommit)}

        <div className="chart-block" data-testid="line-chart">
          <h1 className="chart-heading">Commit History</h1>
          <LineChart width={600} height={300} data={quarterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" />
          </LineChart>
        </div>
      </div>
    )
  }

  renderAnalysisView = () => {
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
      <div className="analysis-page-container">
        <Header />
        {username === ''
          ? this.renderEmptyUsernameView()
          : this.renderAnalysisView()}
      </div>
    )
  }
}

Analysis.contextType = GithubContext

export default Analysis
