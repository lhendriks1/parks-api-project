'use strict';

const apiKey = '5hXbGidvmoqkJVRnDoGHz0VhagfufHtdtjainuPv';
const npsEndPointUrl = 'https://developer.nps.gov/api/v1/parks';

function formatParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);

  $('#results-list').empty();




  const geocodeEndPoint = 'http://www.mapquestapi.com/geocoding/v1/reverse';
  const mapsApiKey = 'oHKlSGAg8YwWwSQo2kApEavQHBG6Cn1p';

  for (let i = 0; i < responseJson.data.length; i++) {
    let fullName = responseJson.data[i].fullName;
    let desc = responseJson.data[i].description;
    let url = responseJson.data[i].url;
    let latLongStr = responseJson.data[i].latLong.replace(/lat|long|,|:|"/gi, "").split(" ").toString();
    let latLongUrl = `${geocodeEndPoint}?location=${latLongStr}&key=${mapsApiKey}`;

    fetch(latLongUrl)
      .then(responseGm => {
        if (responseGm.ok) {
          return responseGm.json();
        }
        throw new Error(responseGm.statusText);
      })
      .then(function(responseGmJson) {
        var parkArr = [];
        let street = responseGmJson.results[0].locations[0].street;
          if (street === "") {street = "unknown"};
        let city = responseGmJson.results[0].locations[0].adminArea4;
          if (city == "") {city = "unknown"};
        let state = responseGmJson.results[0].locations[0].adminArea3;
          if (state == "") {state = "unknown"};
        parkArr.push(
          {name: fullName,
            street: street,
            city: city,
            state: state,
            desc: desc,
            url: url
          }
        );
        return parkArr;
      })
      .then(parkArr => generateList(parkArr))
      .catch(err => {
      })
  }



    function generateList(parkArr) {
      for (let i = 0; i < parkArr.length; i++) {

      $('#results-list').append(
        `<li><h3>${parkArr[0].name}</h3>
         <p>${parkArr[0].desc}</p>
         <p>${parkArr[0].street}, ${parkArr[0].city}, ${parkArr[0].state}</p>
         <a href="${parkArr[0].url}">${parkArr[0].url}</a>
         </li>`
      )
    };

    $('#results').removeClass('hidden');

  }
}

  function getParks(searchTerms, maxResults=10) {
    const params = {
      api_key: apiKey,
      stateCode: searchTerms,
      limit: maxResults,
    };

    const queryString = formatParams(params);
    const npsUrl = npsEndPointUrl + '?' + queryString;

    fetch(npsUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        console.log(err);
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      })

  }


  function watchForm() {
    $('#js-form').on('submit', function(e) {
      e.preventDefault();

      const searchTerms = $('#js-search-term').val();
      const maxResults = $('#js-max-results').val();
      console.log(searchTerms);
      console.log(maxResults);
      getParks(searchTerms, maxResults);
    })
  }

  $(watchForm);
