# GitHub Profile Visualizer

A responsive React web app where you search any GitHub username and explore their profile, repositories, repository details, and coding analysis through interactive charts.

> **AI Full Stack Project:** This project was created using **Claude AI**, and errors were fixed and the code refined using **GitHub Copilot** and **Claude**.

- 🔗 **Live Demo:** _add your deployed link here_
- 💻 **Source Code:** https://github.com/gaddamvedavyas2002/github-profile-visualizer

---

## Table of Contents

1. [Screenshots](#screenshots)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [How I Built This With AI](#how-i-built-this-with-ai)
5. [Getting Started](#getting-started)
6. [API Integration](#api-integration)
7. [Routing](#routing)
8. [Context API](#context-api)
9. [Handling API Views](#handling-api-views)
10. [Charts With Recharts](#charts-with-recharts)
11. [Responsive Design](#responsive-design)
12. [Test IDs and Alt Texts](#test-ids-and-alt-texts)
13. [Project Structure](#project-structure)
14. [Troubleshooting](#troubleshooting)
15. [What I Learned](#what-i-learned)
16. [Author](#author)

---

## Screenshots

_Add screenshots here: Home, Repositories, Repository Details, Analysis, Failure view, Mobile view._

---

## Features

### Home (`/`)
- Search a GitHub username using the search input and the search icon button
- Shows profile picture, name, username, bio, followers, following, public repos, company, blog and location
- Loader while fetching, failure view with a **Try Again** button if the request fails

### Repositories (`/repositories`)
- Lists all public repositories of the searched user (owner avatar, owner login, repository name, language, stars, forks)
- Clicking a repository opens its details page
- **No Data Found** view if no username has been searched, and **No Repositories Found** view if the list is empty

### Repository Item Details (`/repositories/:repoName`)
- Shows repository name, language, stars, forks, watchers count and issues count
- Contributors list with profile pictures
- Languages used, with a pie chart

### Analysis (`/analysis`)
- Pie chart: languages per repository
- Pie chart: languages per commit
- Pie chart: commits per repository (top 10)
- Line chart: commit history by quarter
- **No Data Found** view if no username has been searched

### General
- Header with title, Home, Repositories and Analysis links on every page
- Not Found page for any unknown URL
- Responsive for mobile, tablet and desktop

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 17 (class components), JavaScript (ES6+), HTML5, CSS3 |
| Routing | React Router DOM 5 |
| Global State | React Context API |
| Charts | Recharts 2 |
| Icons | React Icons 4 |
| Loader | react-loader-spinner 4 |
| API Calls | Fetch API (async/await) |
| Code Quality | ESLint (Airbnb), Prettier, Husky |
| AI Tools | Claude AI, GitHub Copilot |

---

## How I Built This With AI

1. **Understood the requirements.** Studied the project brief: routes, API endpoints, test IDs, views and the Figma design.
2. **Generated the base with Claude AI.** Used Claude to generate the components, routing, context and API integration from the requirements.
3. **Built route by route.** Home first, then Repositories, Repository Item Details, Analysis and Not Found.
4. **Fixed errors with GitHub Copilot and Claude.** Copilot inside VS Code for suggestions and quick fixes, Claude for deeper debugging (API response mapping, chart data formatting, test-case failures).
5. **Tested manually.** Verified every route, loader, failure view, No Data view and mobile layout.
6. **Reviewed the code.** Went through each component to understand how it works.

---

## Getting Started

### Prerequisites
- Node.js and npm (the project's `package.json` lists Node 10, 12, 14 or 15 in `engines`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gaddamvedavyas2002/github-profile-visualizer.git

# 2. Go to the project folder
cd github-profile-visualizer

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app runs at `http://localhost:3000`.

### Available Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Runs the app in development mode |
| `npm test` | Runs the test cases |
| `npm run build` | Creates a production build |
| `npm run lint:fix` | Fixes lint issues in `src/` |
| `npm run format` | Formats the code with Prettier |

---

## API Integration

The app fetches data from four endpoints. The searched username (and repository name) is added to the URL as a path parameter.

| Purpose | Method | Endpoint | Used in |
| --- | --- | --- | --- |
| Profile details | GET | `https://apis.ccbp.in/gpv/profile-details/{username}` | Home |
| Repositories list | GET | `https://apis.ccbp.in/gpv/repos/{username}` | Repository |
| Repository item details | GET | `https://apis.ccbp.in/gpv/specific-repo/{username}/{repoName}` | RepositoryItemDetails |
| Analysis | GET | `https://apis.ccbp.in/gpv/profile-summary/{username}` | Analysis |

Example: `https://apis.ccbp.in/gpv/profile-details/kentcdodds`

### Key fields used from each response

| API | Fields used |
| --- | --- |
| Profile details | `avatar_url`, `name`, `login`, `bio`, `followers`, `following`, `public_repos`, `company`, `blog`, `location` |
| Repositories | `id`, `name`, `language`, `stargazers_count`, `forks_count`, `owner.login`, `owner.avatar_url` |
| Repository item | `name`, `language`, `stargazers_count`, `forks_count`, `watchers_count`, `open_issues_count`, `contributors`, `lanuages` (spelled this way in the API response) |
| Analysis | `user.login`, `user.avatarUrl`, `quarterCommitCount`, `langRepoCount`, `langCommitCount`, `repoCommitCount` |

### Fetching data (pattern used in every route)

```jsx
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

getProfileDetails = async () => {
  const {searchInput} = this.state
  const {updateUsername} = this.context

  // Share the searched username with the other routes via context
  updateUsername(searchInput)
  this.setState({apiStatus: apiStatusConstants.inProgress})

  const apiUrl = `https://apis.ccbp.in/gpv/profile-details/${searchInput}`

  try {
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      this.setState({profileData: data, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  } catch (error) {
    this.setState({apiStatus: apiStatusConstants.failure})
  }
}
```

The Repository, RepositoryItemDetails and Analysis routes follow the same pattern with their own URLs. They fetch in `componentDidMount` when a username exists in context.

> **Note:** The API is hosted by NxtWave (CCBP) for this learning project. No personal access token is stored in the repository.

---

## Routing

Defined in `App.js` using React Router v5:

| Path | Component |
| --- | --- |
| `/` | Home |
| `/repositories` | Repository |
| `/repositories/:repoName` | RepositoryItemDetails |
| `/analysis` | Analysis |
| Any other path | NotFound |

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route exact path="/repositories" component={Repository} />
  <Route exact path="/repositories/:repoName" component={RepositoryItemDetails} />
  <Route exact path="/analysis" component={Analysis} />
  <Route component={NotFound} />
</Switch>
```

`BrowserRouter` wraps `<App />` in `index.js`. The `:repoName` URL parameter is read with `this.props.match.params` in RepositoryItemDetails.

---

## Context API

The username searched on Home is needed by the Repository, Repository Item Details and Analysis routes, so it is stored in a Context instead of the URL.

```jsx
// src/context/GithubContext.js
const GithubContext = React.createContext({
  username: '',
  updateUsername: () => {},
})
```

```jsx
// App.js: state and Provider
state = {username: ''}

updateUsername = username => {
  this.setState({username})
}

<GithubContext.Provider value={{username, updateUsername: this.updateUsername}}>
  {/* Routes */}
</GithubContext.Provider>
```

```jsx
// Any route: read the value with contextType
Analysis.contextType = GithubContext
const {username} = this.context
```

If `username` is empty on the Repository or Analysis route, the **No Data Found** view is shown.

---

## Handling API Views

Every route follows the same four-view pattern with a `switch` on `apiStatus`:

| View | When it shows | Details |
| --- | --- | --- |
| Loader | Request in progress | Shared `Loader` component, container with `data-testid="loader"` |
| Success | Data fetched | Renders the response data |
| Failure | Request failed | Image with alt `failure view` and a **Try Again** button that calls the API again |
| No Data | No username searched | Route specific image and a **Go to Home** button |

```jsx
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
```

---

## Charts With Recharts

The Analysis API returns objects, but Recharts needs arrays, so the data is converted first.

```jsx
const convertToChartData = obj =>
  Object.entries(obj || {}).map(([key, value]) => ({name: key, value}))

// Quarterly commits for the line chart
const quarterData = Object.entries(quarterCommitCount || {}).map(
  ([quarter, count]) => ({quarter, count}),
)

// Top 10 repositories by commit count for the pie chart
const top10RepoCommit = Object.entries(repoCommitCount || {})
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([name, value]) => ({name, value}))
```

Charts used:
- **PieChart:** Language Per Repos, Language Per Commits, Commits Per Repo (Top 10), and languages in Repository Item Details
- **LineChart:** Commit History by quarter

---

## Responsive Design

- Built with **CSS media queries** (the same elements adapt to the screen, nothing is rendered twice)
- Breakpoints used include 480px, 576px, 650px, 768px and 991px
- Header, profile, repository cards and charts adjust for mobile and tablet

---

## Test IDs and Alt Texts

| Element | Attribute |
| --- | --- |
| Loader container | `data-testid="loader"` |
| Search button | `data-testid="searchButton"` |
| Repository item | `data-testid="repoItem"` |
| Pie chart block | `data-testid="pie-chart"` |
| Line chart block | `data-testid="line-chart"` |
| Languages list | `data-testid="languages-list"` |
| Failure image | `alt="failure view"` |
| Home page image | `alt="github profile visualizer home page"` |
| Empty repositories image | `alt="empty repositories"` |
| No repositories image | `alt="no repositories"` |
| Empty analysis image | `alt="empty analysis"` |
| Contributor images | `alt="contributor profile"` |

Icons from `react-icons`: `HiOutlineSearch` (search), `RiBuildingLine` (company), `IoMdLink` (blog), `IoLocationOutline` (location).

---

## Project Structure

```
github-profile-visualizer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Analysis/
│   │   ├── Header/
│   │   ├── Home/
│   │   ├── Loader/
│   │   ├── NotFound/
│   │   ├── Repository/
│   │   └── RepositoryItemDetails/
│   ├── context/
│   │   └── GithubContext.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Repositories or Analysis shows No Data Found | Search a username on the Home page first (the username is kept in context, so a page refresh clears it) |
| Failure view on search | Check the username spelling and your internet connection, then click **Try Again** |
| `npm start` fails with an OpenSSL error | The start script already sets `NODE_OPTIONS=--openssl-legacy-provider` through `cross-env` |
| Charts not showing | Convert the API objects into arrays before passing them to Recharts |

---

## What I Learned

- Building multi-route React apps with React Router
- Sharing state across routes with the Context API
- Fetching data and handling loading, success and failure states
- Transforming API data for Recharts
- Writing responsive layouts with media queries
- Using AI tools (Claude AI, GitHub Copilot) effectively for building and debugging

---

## Author

**Vedavyas Gaddam**, Python Full Stack Developer

- GitHub: [gaddamvedavyas2002](https://github.com/gaddamvedavyas2002)
- LinkedIn: [vedavyas-gaddam](https://www.linkedin.com/in/vedavyas-gaddam/)