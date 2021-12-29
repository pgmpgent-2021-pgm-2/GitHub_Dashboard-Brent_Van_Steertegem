(() => { 
  const app = {
    initialize () {
      this.cacheElements();
      this.updateWeather();
      this.updateCovidCases();
      this.initializeDashboard();
      this.updatePgmTeam();
      document.querySelector('#search_submit').addEventListener('click', this.searchUsers);
      
    },
    cacheElements() {
      this.$covidCases = document.querySelector('#covid_cases');  
      this.$weatherIcon = document.querySelector('#weather_icon');  
      this.$weather = document.querySelector('#weather');  
      this.$githubUsers = document.querySelector('#github_users');
      this.$userAvatar = document.querySelector('#user_avatar');
      this.$pgmUser = document.querySelector('#pgm_user')
      this.$quote = document.querySelector('#quote');
      this.$repositories = document.querySelector('#repositories');
      this.$followers = document.querySelector('#followers');
      this.$pgmTeam = document.querySelector('#pgm_team');  
    }, 
    updateCovidCases () {
      getCovidCases ()
      .then((data) => {
        this.$covidCases.innerHTML = data.records[0].fields.cases;
      })
      .catch((error) => {
        console.log(error)
      });
    },
    updateWeather () {
      getWeather ()
      .then((data) => {
        this.$weatherIcon.src = data.current.condition.icon;
        this.$weather.innerHTML = `${data.current.temp_c}°C`;
      })
      .catch((error) => {
        console.log(error)
      });
    },
    searchUsers () {
      getUsers (document.querySelector('#search_param').value)
      .then((data) => {
        const users = data.items;
        console.log(users);
        document.querySelector('#github_users').innerHTML = users.map((user) => {
            return `
              <li>
                <div class="github_list_item">
                  <img src="${user.avatar_url}" loading="lazy" alt="Avatar" />
                  <p class="username">${user.login}</p>
                </div>
              </li>          
`;
        }).join('');
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        document.querySelectorAll('.github_list_item').forEach(item => {item.addEventListener('click', app.loadUser)});
      });    
    },
    loadUser () {
      getUser(this.querySelector('.username').innerHTML)
      .then((data) => {
        app.loadDashboard(data, false);
      })
      .catch((error) => {
      console.log(error)
    });
    },
    loadDashboard (data, internalData) {
      if (internalData) {   
        if (this.$pgmUser.classList.contains('hidden')) {
          this.$pgmUser.classList.remove('hidden');   
        }             
        username = data.portfolio.github_gebruikersnaam;
        this.$userAvatar.src = data.thumbnail;
        if (data.lijfspreuk != ""){
          this.$quote.innerHTML = data.lijfspreuk;
        } else {
          this.$quote.innerHTML = 'Deze gebruiker heeft geen lijfspreuk opgegeven.'
        }
      } else {
        if (!this.$pgmUser.classList.contains('hidden')) {
          this.$pgmUser.classList.add('hidden');   
        }         
        username = data.login;
        this.$userAvatar.src = data.avatar_url;
      }
      getRepositories(username)
        .then((repositories) => {
          getFollowers(username)
          .then((followers) => {
            this.$repositories.innerHTML = repositories.map((repository) => {
              return `
                <li>
                  <div>
                    <p>${repository.name}</p>
                  </div>
                </li>          
      `;
            }).join('');
            this.$followers.innerHTML = followers.map((follower) => {
              return `
                <li>
                  <div>
                    <img src="${follower.avatar_url}" loading="lazy" alt="avatar" />
                    <p class="username">${follower.login}</p>
                  </div>
                </li>          
      `;
            }).join('');
          })
          .catch((error) => {
            console.log(error)
          });
        })
        .catch((error) => {
          console.log(error)
        });
    },
    initializeDashboard () {
      getUser('pgmgent')
      .then((data) => {
        app.loadDashboard(data, false);
      })
      .catch((error) => {
      console.log(error)
    });
    },
    loadUserFromJson () {
      const username = this.querySelector('.username').innerHTML;
      getJsonByPromise()
      .then((data) => {
        const user = data.find(user => user.portfolio.github_gebruikersnaam === username);
            app.loadDashboard(user, true)
          })
      .catch((error) => {
        console.log(error)
      });
    },
    updatePgmTeam () {
      getJsonByPromise()
        .then((data) => {
          const users = data;
            this.$pgmTeam.innerHTML = users.map((user) => {
              return `
                <li>
                  <div class="pgm_list_item">
                    <img src="${user.thumbnail}" loading="lazy" alt="Avatar" />
                    <p class="username">${user.portfolio.github_gebruikersnaam}</p>
                  </div>
                  <p>${user.voornaam} ${user.familienaam}</p>
                </li>          
`;
            }).join('');
        })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        document.querySelectorAll('.pgm_list_item').forEach(item => {item.addEventListener('click', app.loadUserFromJson)});
      });
    }
  }
  app.initialize();
})();