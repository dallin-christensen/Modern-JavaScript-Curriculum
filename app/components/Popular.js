const React = require('react');
const PropTypes = require('prop-types');
const api = require('../utils/api');
const Loading = require('./Loading');

function SelectLanguage ({ selectedLanguage, onSelect }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

  return (
    <ul className='languages'>
      {languages.map((lang) => {
        return (
          <li
            style={lang === selectedLanguage ? {color: '#d0021b'} : null}
            onClick={() => onSelect(lang)}
            key={lang}>
              {lang}
          </li>
        )
      })}
    </ul>
  )
}

function RepoGrid ({ repos }) {
  return (
    <ul className='popular-list'>
      {repos.map((repo, index) => {
        return (
          <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img
                  className='avatar'
                  src={repo.owner.avatar_url}
                  alt={'Avatar for ' + repo.owner.login}
                />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

class Popular extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectedLanguage: 'All',
      repos: null,
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }
  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }
  updateLanguage(lang) {
    this.setState(() => ({ selectedLanguage: lang, repos: null }));

    api.fetchPopularRepos(lang)
      .then((repos) => this.setState(() => ({ repos })) );
  }
  render() {
    const { selectedLanguage, repos } = this.state;

    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />
        {!repos ? <Loading /> : <RepoGrid repos={repos} />}
      </div>
    )
  }
}

module.exports = Popular;
