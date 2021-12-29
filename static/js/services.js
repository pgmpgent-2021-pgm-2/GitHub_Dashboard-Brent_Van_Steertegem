// Covid cases in Ghent
async function getCovidCases () {
  const covidCasesAPI = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';
  try {
    const response = await fetch(covidCasesAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Weather in Ghent
async function getWeather () {
  const city = 'Ghent';
  const weatherAPIKey =  'aca7359c0786439399d92653212412';
  const weatherAPI = `http://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${city}`;
  try {
    const response = await fetch(weatherAPI, {});
    const data = await response.json();
    return data;    
  } catch (error) {
    console.error(error);
  }
}

// Github users by search
async function getUsers (name) {
  const githubUsersAPI = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${name}`;
  try {
    const response = await fetch(githubUsersAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

//Github user details
async function getUser (username) {
  const githubUserAPI = `https://api.github.com/users/${username}`;
  try {
    const response = await fetch(githubUserAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getRepositories (username) {
  const repositoriesAPI = `https://api.github.com/users/${username}/repos?page=1&per_page=50`;
  try {
    const response = await fetch(repositoriesAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getFollowers (username) {
  const followersAPI = `https://api.github.com/users/${username}/followers?page=1&per_page=100`
  try {
    const response = await fetch(followersAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Users (in pgm.json)
function getJsonByPromise () {
  const url = './static/data/pgm.json';
  return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', url, true);
      xhr.onload = () => {
      if (xhr.status === 200) {
          const data = (!xhr.responseType) ? JSON.parse(xhr.response) : xhr.response;
          resolve(data);
      } else {
          reject(xhr.status);
      }
      };
      xhr.onerror = () => {
          reject(Error('Network Error!'));
      };
      xhr.send(null);
  });
}
