(() => { 
  const app = {
    initialize () {
      this.cacheElements();
      this.updateClock();
      this.updateWeather();
      this.updateCovidCases();
      this.initializeDashboard();
      this.updatePgmTeam();
      document.querySelector('#logo').addEventListener('click', this.initializeDashboard);
      document.querySelector('#light_mode').addEventListener('click', this.changeMode);
      document.querySelector('#search_enter').addEventListener('click', this.searchUsers);
      document.querySelector('#search_param').addEventListener('keyup', this.searchByEnter);      
    },
    cacheElements() {
      this.$covidCases = document.querySelector('#covid_cases');  
      this.$weatherIcon = document.querySelector('#weather_icon');  
      this.$weather = document.querySelector('#weather');  
      this.$githubUsers = document.querySelector('#github_users');
      this.$userAvatar = document.querySelector('#user_avatar');
      this.$pgmUser = document.querySelector('#pgm_user');
      this.$dashboardUsername = document.querySelector('#dashboard_username');
      this.$quote = document.querySelector('#quote');
      this.$labelIsLecturer = document.querySelector('#label_is_lecturer');
      this.$isLecturer = document.querySelector('#is_lecturer');
      this.$birthday = document.querySelector('#birthday');
      this.$linkedInUsername = document.querySelector('#linkedIn_username');
      this.$userType = document.querySelector('#user_type');
      this.$linkPage = document.querySelector('#link_page');
      this.$repositories = document.querySelector('#repositories');
      this.$followers = document.querySelector('#followers');
      this.$pgmTeam = document.querySelector('#pgm_team');  
    }, 
    changeMode () {
      if (document.querySelector('#light_mode').checked == true) {
          document.body.classList.add('light_mode');
      } else {
          document.body.classList.remove('light_mode');
      }
    },
    updateClock () {
      document.querySelector('#clock').innerHTML = new Date().toLocaleTimeString('nl-BE', 'Ghent');
      setInterval(this.updateClock, 1000);
    },
    updateCovidCases () {
      new CovidApi().getCovidCases ()
      .then((data) => {
        this.$covidCases.innerHTML = data.records[0].fields.cases;
      })
      .catch((error) => {
        console.log(error)
      });
    },
    updateWeather () {
      new WeatherApi().getWeather ()
      .then((data) => {
        this.$weatherIcon.src = data.current.condition.icon;
        this.$weather.innerHTML = `${data.current.temp_c}°C`;
      })
      .catch((error) => {
        console.log(error)
      });
    },
    searchByEnter () {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector('#search_enter').click();
      }
    },
    searchUsers () {
      event.preventDefault();
      new GithubApi().getUsers (document.querySelector('#search_param').value)
      .then((data) => {
        console.log(data);
        if (data.total_count > 0) {
          const users = data.items;
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
        } else {
          document.querySelector('#github_users').innerHTML = '<li class="no_items"><p>Geen gebruikers gevonden</p></li>';
        }        
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        document.querySelectorAll('.github_list_item').forEach(item => {item.addEventListener('click', app.loadUser)});
      });    
    },
    loadUser () {
      new GithubApi().getUser(this.querySelector('.username').innerHTML)
      .then((data) => {
        app.loadDashboard(data, false);
      })
      .catch((error) => {
      console.log(error)
    });
    },
    loadDashboard (data, internalData) {
      const githubApi = new GithubApi();
      this.$repositories.innerHTML = "<p>Loading..</p>";
      this.$followers.innerHTML = "<p>Loading..</p>";
      let username;
      if (internalData) {   
        if (this.$pgmUser.classList.contains('hidden')) {
          this.$pgmUser.classList.remove('hidden');   
        }             
        username = data.portfolio.github_gebruikersnaam;
        this.$userAvatar.style.backgroundImage = `url("./static/media/images/${data.thumbnail}")`;
        this.$dashboardUsername.innerHTML = username;
        if (data.lijfspreuk != ""){
          this.$quote.innerHTML = data.lijfspreuk;
        } else {
          this.$quote.innerHTML = 'Deze gebruiker heeft geen lijfspreuk opgegeven.'
        }
        this.$labelIsLecturer.innerHTML = username;
        if (data.is_docent) {
          this.$isLecturer.innerHTML = `${data.voornaam} ${data.familienaam} is een docent binnen het pgm-team.`
        } else {
          this.$isLecturer.innerHTML = `${data.voornaam} ${data.familienaam} is een student binnen het pgm-team.`
        }
        this.$birthday.innerHTML = `${Math.floor((Math.floor(new Date().getTime()/1000) - data.geboortedatum)/3600/24/365)} jaar`;
        if (data.portfolio.linkedin_gebruikersnaam != ""){
          this.$linkedInUsername.innerHTML = data.portfolio.linkedin_gebruikersnaam;
        } else {
          this.$linkedInUsername.innerHTML = 'Deze gebruiker heeft geen LinkedIn gebruikersnaam opgegeven.'
        }
        githubApi.getUser(username)
        .then((externalData) => {
          this.$userType.innerHTML = externalData.type;
          this.$linkPage.innerHTML = `Klik hier om naar de pagina van <span>${username}</span> te gaan.`;
          this.$linkPage.href = externalData.html_url;
        })
        .catch((error) => {
          console.log(error)
        });
      } else {
        if (!this.$pgmUser.classList.contains('hidden')) {
          this.$pgmUser.classList.add('hidden');   
        }         
        username = data.login;
        this.$userAvatar.style.backgroundImage = `url("${data.avatar_url}")`;
        this.$dashboardUsername.innerHTML = username;
        this.$userType.innerHTML = data.type;
        this.$linkPage.innerHTML = `Klik hier om naar de pagina van <span>${username}</span> te gaan.`;
          this.$linkPage.href = data.html_url;
      }
      githubApi.getRepositories(username)
        .then((repositories) => {
          githubApi.getFollowers(username)
          .then((followers) => {
            if (repositories.length > 0) {              
            this.$repositories.innerHTML = repositories.map((repository) => {
              return `
                <li>
                  <div>
                    <p>${repository.name}</p>
                  </div>
                </li>          
              `;
            }).join('');
            } else {
              this.$repositories.innerHTML = `
                  <li class="no_items">
                  <p>Geen repositories!</p>
                  </li>          
                `;
            }
            if (followers.length > 0) {
              this.$followers.innerHTML = followers.map((follower) => {
                return `
                  <li>
                  <a href="${follower.html_url}">
                      <div>
                        <img src="${follower.avatar_url}" loading="lazy" alt="avatar" />
                        <p class="username">${follower.login}</p>
                      </div>
                    </a>
                  </li>          
                `;
              }).join('');
            } else {
              this.$followers.innerHTML = `
                  <li class="no_items">
                  <p>Geen volgers!</p>
                  </li>          
                `;
            }            
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
      new GithubApi().getUser('pgmgent')
      .then((data) => {
        app.loadDashboard(data, false);
      })
      .catch((error) => {
      console.log(error)
    });
    },
    loadUserFromJson () {
      const username = this.querySelector('.username').innerHTML;
      new GetJson().getJsonByPromise()
      .then((data) => {
        const user = data.find(user => user.portfolio.github_gebruikersnaam === username);
            app.loadDashboard(user, true)
          })
      .catch((error) => {
        console.log(error)
      });
    },
    updatePgmTeam () {
      new GetJson().getJsonByPromise()
        .then((data) => {
          const users = data;
            this.$pgmTeam.innerHTML = users.map((user) => {
              return `
                <li>
                  <div class="pgm_list_item">
                    <div>
                      <img src="./static/media/images/${user.thumbnail}" loading="lazy" alt="Avatar" />
                      <p class="username">${user.portfolio.github_gebruikersnaam}</p>
                    </div>
                    <p>${user.voornaam} ${user.familienaam}</p>
                  </div>
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