# Questions

1. Pourquoi doit-on projeter des données cartographiques?

Pour une meilleure vision de ces données dans un format adapté.

2. Qu'est ce qu'Open street map?

Un "Google Maps" open-source.

3. Quelles fonctions D3 sont spécifiques à la cartographie?

geoMercator, geoPath, etc. : Toute la sous-librairie d3-geo.

4. À quoi sert le format `topojson`? En quoi est-il différent du `geojson`?

topoJSON est une extension de geoJSON, qui encode les données sous forme d'arc, et non de points. Elle permet un traitement plus compact des données pour des opérations issues de la topographie.

5. À quoi sert `turf`? Décrivez ce que font trois fonctions de cette libraire

C'est une librairie d'analyse géospatiale.

- distance : retourne la distance en KM entre deux points
- along : place un point le long d'une ligne, à une distance spécifiée
- circle : calcule le cercle ayant un point comme centre, avec un rayon spécifié, en km, miles, ou pas.