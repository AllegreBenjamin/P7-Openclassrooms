# P7-Openclassrooms - Lancez votre propre site d'avis de restaurants

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3e8b57f9f2184b3285987b2de9c4b31c)](https://www.codacy.com/manual/thomas-claireau/P7-Openclassrooms?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=thomas-claireau/P7-Openclassrooms&amp;utm_campaign=Badge_Grade)

## Utilisation du projet

Commencez par cloner le projet :

````text
git clone https://github.com/thomas-claireau/P7-Openclassrooms.git
````

Le projet fonctionne avec l'api de Google Maps et fait fonctionner plusieurs librairies telles que Search, Places...

Pour celà, le projet nécessite pour fonctionner une clé API que vous allez devoir renseigner.

Créez un fichier `key.json` dans `./src/assets/data` avec la structure suivante :

````json
{
	"key": "API_KEY",
	"keyGeocodingPlaces": "API_KEY_NO_RESTRICTED",
	"host": "HOST_URL"
}
````

- key : votre clé API, utilisée ensuite dans le projet pour charger les librairies Google
- keyGeocodingPlaces : utilisée pour charger l'API de Geocoding qui nécessite une clé non restreinte
- host : l'url de votre projet (pensez à bien restreinte votre clé API à cette url pour éviter les clés compromises). Cette url est utilisé pour lancer le webpack-dev-server de la configuration Webpack.


## Brief du projet

Vous avez choisi de vous lancer dans le business des avis de restaurants. Votre objectif : créer un service simple et utile qui permet d'avoir des avis sur des restaurants autour de soi.

Pour ce projet, vous allez devoir apprendre à utiliser des API externes, telles que celles de Google Maps et de Google Places (votre plus gros concurrent). Et ce n'est pas tout : vous allez devoir orchestrer toutes ces informations de manière cohérente dans votre application !

### Etape 1 : la carte des restaurants

Commencez par les fondations de votre application. Il y aura 2 sections principales :

* Une carte Google Maps, chargée avec l'[API de Google Maps](https://developers.google.com/maps/?hl=fr)
* Une liste de restaurants correspondant à la zone affichée sur la carte Google Maps

Vous placerez ces éléments côte à côte.

La carte Google Maps sera centrée immédiatement sur la position de l'utilisateur. Vous utiliserez l'API de géolocalisation de JavaScript. Un marqueur de couleur spécifique sera placé à l'emplacement de l'utilisateur.

Une liste de restaurants est fournie sous forme de données JSON présentées dans un fichier à part. En temps normal, ces données vous seraient renvoyés par un backend via une API, mais pour cet exercice il sera pour le moment suffisant de charger en mémoire tous les restaurants en mémoire directement.

Voici un exemple de fichier JSON avec déjà 2 restaurants pré-remplis (vous devriez en ajouter un peu plus) :

````json
[
   {
      "restaurantName":"Bronco",
      "address":"39 Rue des Petites Écuries, 75010 Paris",
      "lat":48.8737815,
      "long":2.3501649,
      "ratings":[
         {
            "stars":4,
            "comment":"Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
         },
         {
            "stars":5,
            "comment":"Tout simplement mon restaurant préféré !"
         }
      ]
   },
   {
      "restaurantName":"Babalou",
      "address":"4 Rue Lamarck, 75018 Paris",
      "lat":48.8865035,
      "long":2.3442197,
      "ratings":[
         {
            "stars":5,
            "comment":"Une minuscule pizzeria délicieuse cachée juste à côté du Sacré choeur !"
         },
         {
            "stars":3,
            "comment":"J'ai trouvé ça correct, sans plus"
         }
      ]
   }
]
````

Affichez ces restaurants grâce à leurs coordonnées GPS sur la carte. Les restaurants qui sont actuellement visibles sur la carte doivent être affichés sous forme de liste sur le côté de la carte. Vous afficherez la moyenne des commentaires de chaque restaurant (qui va de 1 à 5 étoiles).

Lorsqu'on clique sur un restaurant, la liste des avis enregistrés s'affiche avec les commentaires. Affichez aussi la photo [Google Street View grâce à l'API correspondante](https://developers.google.com/maps/documentation/streetview/?hl=fr).

Un outil de filtre permet d'afficher uniquement les restaurants ayant entre X et Y étoiles. La mise à jour de la carte s'effectue en temps réel.

### -> Etape 2 : ajoutez des restaurants et des avis ! ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-2))
