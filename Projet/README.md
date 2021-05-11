# Projet

## 11 mai

- Désactivation du `setInterval`, un peu "too much" ;
- Amélioration de la CSS de la page, utilisation de Bootstrap pour la mise en page ;
- Ajout du titre principal, d'une description et d'une légende ;
- Mise en production à l'adresse : <a href="http://visualdon.redox-prod.ch/dist/index.html" targe="_blank">http://visualdon.redox-prod.ch/dist/index.html</a>.

## 10 mai

- Création du projet Webpack ;
- Préparation des données, transformation des fichiers CSV en JSON *(via la fonction csvToJSON)* ;
- Implémentation de la carte, du slider, de la barre de progression et de l'affichage dynamique de l'année.

## 9 mai

Premières idées de visualisations :

- Utiliser la visualisation de Rosling pour afficher l'évolution, sur une carte, de la construction des éoliennes
- À côté ou en dessous, afficher une jauge qui représente la production moyenne du parc éolien suisse
- Diagrammes "donut" pour la distribution de la production, en fonction du producteur, et/ou du type d'infrastructure

**Inspirations**
- [Bar race](https://github.com/idris-maps/heig-datavis-2021/tree/master/20210416#graphique-de-type-bar-race)
- [Map slider](https://digital-geography.com/filter-leaflet-maps-slider/)


**Outils :** 
- Leaflet pour la carte
- D3 pour la barre de progression 


## 30 avril

Mise à jour : le projet sera probablement orienté vers l'énergie et les installations éoliennes suisses.

### Éléments contenus dans le *dataset*

- **Plant.Facility.csv** : Noms des différents producteurs d'énergie éolienne, avec le type d'éolienne *(grande éolienne, parc éolien, etc.)*, la quantité d'énergie produite et la position géographique, en coordonnées suisses.

- **Plant.Turbine.csv** : Liste des différentes turbines, avec l'altitude à laquelle elles se trouvent, l'année de construction, le constructeur, le modèle et la taille, ainsi que la puissance émise, et l'emplacement géographique.

- **Production.Production.csv** : Liste des quantités produises par les différents fournisseurs d'énergie durant les années X (1997 à 2020).

### Source principale

- [Installations éoliennes](https://opendata.swiss/fr/dataset/windenergieanlagen)

### Sources secondaires

- [BP Review](https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy.html)
- [Carte de base de la Confédération concernant les principales zones à potentiel éolien](https://opendata.swiss/fr/dataset/konzept-windenergie-grundlagenkarte-des-bundes-betreffend-die-hauptsachlichen-windpotenzialgebi)


### Sources en réserve

- [Plan des stations de recharge](https://opendata.swiss/fr/dataset/ladestationen-fuer-elektroautos)

- [Statistiques des voitures neuves](https://opendata.swiss/fr/dataset/kennzahlen-neuwagenflotte)

- [Statistiques des motorisations alternatives des voitures neuves](https://www.bfe.admin.ch/bfe/fr/home/approvisionnement/statistiques-et-geodonnees/statistiques-des-vehicules/statistiques-des-motorisations-alternatives-des-voitures-neuves.html)

- [Chiffres-clés concernant l’infrastructure de recharge pour la mobilité électrique](https://opendata.swiss/fr/dataset/kennzahlen-offentliche-ladeinfrastruktur-elektromobilitat)

- **[Bilan de SuisseEnergie](https://pubdb.bfe.admin.ch/fr/publication/download/9460)**
- ... qui est un résumé de l'étude suivante : [Life cycle environmental and cost comparison of current and future passenger cars under different energy scenarios](https://www.sciencedirect.com/science/article/pii/S030626192030533X)



## 16 avril

L'idée du projet serait de faire un tour d'horizon de la **production d'électricité verte** en Suisse et/ou des émissions de CO2 émises par la **voiture électrique**. À voir, selon les données disponibles. 