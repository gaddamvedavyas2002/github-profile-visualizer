import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from './components/Home'
import Repository from './components/Repository'
import RepositoryItemDetails from './components/RepositoryItemDetails'
import Analysis from './components/Analysis'
import NotFound from './components/NotFound'
import GithubContext from './context/GithubContext'

import './App.css'

class App extends Component {
  state = {username: ''}

  updateUsername = username => {
    this.setState({username})
  }

  render() {
    const {username} = this.state

    return (
      <GithubContext.Provider
        value={{username, updateUsername: this.updateUsername}}
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/repositories" component={Repository} />
          <Route
            exact
            path="/repositories/:repoName"
            component={RepositoryItemDetails}
          />
          <Route exact path="/analysis" component={Analysis} />
          <Route component={NotFound} />
        </Switch>
      </GithubContext.Provider>
    )
  }
}

export default App
