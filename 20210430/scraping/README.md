# Scraping

Après de nombreux tatonnements, voici la commande entrée pour extraire les différentes données de la page [WebScraper](https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops) : 

```js
var cl = (el, className) => Array.from(el.getElementsByClassName(className))

cl(temp1, 'col-sm-4')
  .map(div => {
    var title = cl(div, 'title')
    var price = cl(div, 'price')
    var ratings = cl(div, 'ratings')

    return {
      produit: title[0].textContent.trim(),
      prix: price[0].textContent.trim(),
      etoiles: ratings[0].getElementsByTagName('p')[0].dataset.rating,
    }
})
```