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

  for (let i = 0; i < responseJson.data.length; i++) {
    let fullName = responseJson.data[i].fullName;
    let desc = responseJson.data[i].description;
    let url = responseJson.data[i].url;

      $('#results-list').append(
        `<li><h3>${fullName}</h3>
         <p>${desc}</p>
         <a href="${url}">${url}</a>
         </li>`
      )

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
