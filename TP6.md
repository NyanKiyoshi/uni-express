# Gestion d'utilisateurs

## Entité User

Ajouter l'entité suivante :
- `User` : contient un champ `username` et un champ `password`
    - une `Person` appartient à un `User`
	- un `User` dispose de plusieurs `Person`
	- un `Group` appartient à un `User`
	- un `User` dispose de plusieurs `Group`

## Routes de base

Ajouter au serveur HTTP la gestion des routes suivantes pour la gestion des utilisateurs :
- `GET /user` : renvoie l'ensemble des utilisateurs sous la forme d'un tableau d'objets en JSON
- `GET /user/:user_id` : renvoie l'utilisateur d'identifiant `user_id` sous la forme d'un objet en JSON
- `POST /user/signup` : ajoute une nouvelle entité `User` en base à partir des données fournies en JSON
    - le nouvel utilisateur doit avoir un `username` unique
    - le mot de passe fourni doit être chiffré à l'aide de la méthode `hashSync` fournie par le module `bcrypt`
	- on pourra écrire une fonction `generate_hash` dans l'objet modèle `User` qui prend une chaîne et retourne la chaîne hachée
- `POST /user/signin` : si le couple (username, password) soumis est correct, renvoie un objet JSON contenant d'une part l'utilisateur identifié et d'autre part un JSONWebToken encapsulant l'`id` de cet utilisateur
    - on pourra écrire une méthode d'instance `check_password` dans le prototype de l'objet modèle `User` qui prend une chaîne et renvoie vrai si elle correspond au mot de passe de l'utilisateur (utiliser la méthode `compareSync` du module `bcrypt`)
	- utiliser le module `jsonwebtoken` pour générer le JSONWebToken (méthode `sign`)

Dans toutes les méthodes retournant des `User`, on fera en sorte que l'attribut `password` ne fasse pas partie des données renvoyées. Pour cela, on pourra surcharger la méthode `toJSON` en en écrivant une nouvelle version dans le prototype de l'objet modèle `User`.

## Filtres

Une fois un JWT obtenu, le client pourra le transmettre systématiquement au serveur avec chacune de ses requêtes au sein d'un header `Authorization` dont le contenu sera de la forme : `Bearer [token-value]`.

À chaque requête, le serveur pourra donc vérifier la validité du JWT fourni et le déchiffrer afin de connaître l'`id` de l'utilisateur se trouvant derrière ce client.

Les routes de notre application pour lesquelles on souhaite connaître l'identité du client vont donc devoir toutes passer par un ou plusieurs middlewares dont l'objectif sera de charger une instance de `User` correspondant au client identifié au sein de l'objet représentant la requête courante (`req`) sous le nom `user`.

On utilisera tout d'abord le module `express-jwt` qui fournit un middleware qui va se charger de décoder le JWT fourni et d'enregistrer l'objet qui y est encapsulé au sein de la variable `req.user`.

Comme on n'a enregistré dans le JWT que l'`id` de l'utilisateur et que l'on souhaite avoir une instance complète du `User` correspondant, on va rajouter un deuxième middleware qui va faire une requête en base de données et remplacer la variable `req.user` par l'instance récupérée.

Rajouter ensuite les routes suivantes :
- `PUT /user/:user_id` : modifie l'utilisateur d'identifiant `user_id` à partir des données fournies en JSON
    - on vérifiera d'abord que le client est bien identifié en tant que l'utilisateur qu'il cherche à modifier
- `DELETE /user/:user_id` : supprime l'utilisateur d'identifiant `user_id`
    - on vérifiera d'abord que le client est bien identifié en tant que l'utilisateur qu'il cherche à supprimer

## On protège tout..

Modifier l'ensemble des routes déjà écrites afin de toujours d'abord charger l'identité du client faisant la requête.
Dans les middlewares qui récupèrent une `Person` ou un `Group` on pourra maintenant profiter des méthodes `getPeople` et `getGroups` de `req.user` afin de se restreindre aux entités appartenant à l'utilisateur en question.

Les seules routes publiques restantes sont les 4 que l'on a définies au début de ce sujet.
