/*
-- DATA --
    weer api
      http://api.weatherapi.com/v1/current.json?key=aca7359c0786439399d92653212412&q=${city}

    aantal positieve Covid-cases in Gent
      https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=

    fetch die wordt aangeroepen na ingeven naam (naam wordt vervangen door waarde uit zoekveld)
      https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=%24%7Bname%7D

    repositories van gebruiker opvragen ({username} vervangen door geselecteerde gebruiker)
      https://api.github.com/users/%24%7Busername%7D/repos?page=1&per_page=50

    followers van gebruiker opvragen ({username} vervangen door geselecteerde gebruiker)
      https://api.github.com/users/%24%7Busername%7D/followers?page=1&per_page=100
*/

// Covid in Ghent
const covidCasesAPI = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';

async function getCovidCases () {
  try {
    const response = await fetch(covidCasesAPI, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Weather in Ghent
const city = 'Ghent';
const weatherAPIKey =  'aca7359c0786439399d92653212412';
const weatherAPI = `http://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${city}`;

async function getWeather () {
  try {
    const response = await fetch(weatherAPI, {});
    const data = await response.json();
    return data;    
  } catch (error) {
    console.error(error);
  }
}

// Github users
const githubUsersAPI = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=`

async function getUsers (name) {
  try {
    const response = await fetch(`${githubUsersAPI}${name}`, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Users (in pgm.json)
const pgmTeam = './static/data/pgm.json';

function getJsonByPromise (url) {
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

// class User {
//     constructor(firstname, lastname, email, thumbnail, quote, portfolio, isTeacher, dateOfBirth) {
//         this.firstname = firstname;
//         this.lastname = lastname;
//         this.email = email;
//         this.thumbnail = thumbnail;
//         this.quote = quote;
//         this.portfolio = portfolio;
//         this.isTeacher = isTeacher;
//         this.dateOfBirth = dateOfBirth;
//     }
// }
