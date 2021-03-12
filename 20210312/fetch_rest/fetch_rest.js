const R = require('ramda')
const fetch = require('node-fetch')

const URL_USERS = 'https://jsonplaceholder.typicode.com/users'
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts'

const get = url => fetch(url).then(data => data.json())

Promise.all([ get(URL_USERS), get(URL_POSTS)]).then(([users, posts]) => {
    users.forEach(user => {

        console.log({
            "nom_utilisteur": getUsername (user),
            "ville": getCity (user),
            "nom_compagnie": getCompanyName (user),
            "titres_posts": getPostsTitles (user, posts)
        })
    })
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

function getPostsTitles (userJson, postsJson) {
    var titles = []
    const id = R.path(['id'], userJson)

    postsJson.find((post) => {
        if(R.path(["userId"],post) == id) {
            titles.push(R.path(["title"], post))
        }
    })

    return titles
}