const R = require('ramda')
const fetch = require('node-fetch')

const URL_USERS = 'https://jsonplaceholder.typicode.com/users'
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts'


fetch(URL_USERS)
  .then(response => response.json())
  .then(json => {
        json.forEach(element => {

            getPostsTitles (element, URL_POSTS)

            /*console.log({
                "nom_utilisteur": getUsername (element),
                "ville": getCity (element),
                "nom_compagnie": getCompanyName (element),
                "titres_posts": getPostsTitles (element, URL_POSTS)
            })*/
      });
  })

function getUsername (obj) {
    return R.path(['username'], obj)
}

function getCity (obj) {
    return R.path(['address', 'city'], obj)
}

function getCompanyName (obj) {
    return R.path(['company', 'name'], obj)
}


function getPostsTitles (userJson, urlPosts) {
    fetch(urlPosts)
        .then(response => response.json())
        .then(jsonPosts => {
            var titles = []
            const id = R.path(['id'], userJson)

            jsonPosts.find((post) => {
                if(R.path(["userId"],post) == id) {
                    titles.push(R.path(["title"], post))
                }
            })
        
            console.log(titles, "---")
        })
}