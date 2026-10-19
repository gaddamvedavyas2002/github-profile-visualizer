import React from 'react'

// Holds the username entered on the Home Route so that the Repository,
// Repository Item Details and Analysis Routes can access it without it
// being part of the URL.
const GithubContext = React.createContext({
  username: '',
  updateUsername: () => {},
})

export default GithubContext
