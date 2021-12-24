/*
-- DATA --
    weer api (voor key={'abc'} 'abc' vervangen door eigen key)
      http://api.weatherapi.com/v1/current.json?key={'abc'}&q=${Ghent}

    aantal positieve Covid-cases in Gent
      https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=

    fetch die wordt aangeroepen na ingeven naam (naam wordt vervangen door waarde uit zoekveld)
      https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=%24%7Bname%7D

    repositories van gebruiker opvragen ({username} vervangen door geselecteerde gebruiker)
      https://api.github.com/users/%24%7Busername%7D/repos?page=1&per_page=50

    followers van gebruiker opvragen ({username} vervangen door geselecteerde gebruiker)
      https://api.github.com/users/%24%7Busername%7D/followers?page=1&per_page=100

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