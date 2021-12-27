/*
-- TO DO --
    - minstens 8 personen beschrijven in pgm.json (data zelf verzamelen)
    - boolean docent geeft aan of persoon docent of student is
    - geboorterdatum is type 'number epoch time'

    - oplijsten van github gebruikersnaam die een naam bevatten, deze wordt ingegeven in een zoekveld, enter knopt roept fetch-methode aan
    - Github-gebruiker selecteren uit lijst toont de details (details inclusief lijfspreuk en leeftijd, repositories en followers)
    - Github gebuiker selecteren door op de portfolio eigenschap github te selecteren toont ook de gebruiker (zelfde scherm als hierboven)

-- Concreet --
    - start van de applicatie: repos en followers van Githuuser pgmgent worden geladen, leden van PGM-team worden ingeladen, positieve COVID-gevallen in Gent worden getoond, huidige weer in Gent (graden in Celsius + afbeelding uit JSON)
    - Klikken op een gebruiker uit de lijst (PGM-team): toont details, repositories en followers (username, avatar en link naar Github-page)
    - Na invoeren in zoekveld: fetch alle personen die voldoen
    - Selecteren van gebruiker uit resultaat zoekopdracht: toont zelfde detail als PGM-user

    - separeer de code per feature
    - in service.js: klassen implementeren (instanties in main.js)
*/
(() => { 
  const app = {
    initialize () {
      this.cacheElements();
      this.updateWeather();
      this.updateCovidCases();
      this.getUsersList();
      this.updateUI();
    },
    cacheElements() {
      this.$covidCases = document.querySelector('#covid_cases');  
      this.$weatherIcon = document.querySelector('#weather_icon');  
      this.$weather = document.querySelector('#weather');  
      this.$usersList = document.querySelector('#users_list');  
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
    getUsersList () {
      getJsonByPromise(pgmUsersList)
        .then((data) => {
          const users = data;
            this.$usersList.innerHTML = users.map((user) => {
              return `
                <li>
                ${user.voornaam} ${user.familienaam}
                </li>          
`;
            }).join('');
        })
      .catch((error) => {
        console.log(error)
      });
    },
    updateUI () {

    }
  }

  app.initialize();
})();