# Association d'entités

Ajouter la définition d'une nouvelle entité Sequelize `MailAddress`.
Celle-ci contient :
- un champ `address` qui est une chaîne de caractère contenant l'adresse mail (faire en sorte que Sequelize vérifie la validité de ce champ)
- un champ `type` qui peut prendre une valeur dans la liste suivante : 'home', 'work'

Associer cette nouvelle entité avec l'entité `Person` de sorte que :
- `MailAddress` appartient à `Person`
- `Person` dispose de plusieurs `MailAddress`

Faire en sorte que les `MailAddress` d'une `Person` soient supprimées lors de la suppression de la `Person`.

# Modularisation

Créer un module `db.js` qui s'occupe de l'initialisation de la connexion à la base de données (création de l'instance `sequelize`), de la définition des entités, puis qui exporte un objet qui contient les modèles définis :
```js
module.exports = { Person, MailAddress };
```

Créer deux modules `person_ctrl.js` et `mail_address_ctrl.js` qui exportent un objet contenant les middlewares manipulant respectivement les enregistrements des entités `Person` et `MailAddress`.
Pour avoir accès aux modèles, ces modules vont charger le module `db.js`.
```js
const db = require('./db');
module.exports = {
	get_all: (req, res, next) => {
		db.Person.findAll()
		.then((people) => { ... })
		.catch((err) => next(err));
	},
	...
};
```

Le programme principal charge les contrôleurs, puis configure l'ensemble des routes.

# Routes

Ajouter au serveur HTTP la gestion des routes suivantes :
- `GET /person/:person_id/mailAddress` : renvoie l'ensemble des addresses mail de la personne d'identifiant `person_id` sous la forme d'un tableau d'objets en JSON
- `POST /person/:person_id/mailAddress` : ajoute une nouvelle entité `MailAddress` en base à la personne d'identifiant `person_id` à partir des données fournies en JSON
- `GET /person/:person_id/mailAddress/:mail_address_id` : renvoie l'adresse mail d'identifiant `mail_address_id` sous la forme d'un objet en JSON si elle appartient bien à la personne d'identifiant `person_id`
- `PUT /person/:person_id/mailAddress/:mail_address_id` : modifie l'adresse mail d'identifiant `mail_address_id` à partir des données fournies en JSON si elle appartient bien à la personne d'identifiant `person_id`
- `DELETE /person/:person_id/mailAddress/:mail_address_id` : supprime l'adresse mail d'identifiant `mail_address_id` si elle appartient bien à la personne d'identifiant `person_id`

Les fonctions de ce contrôleur agissent toutes sur une entité appartenant à une `Person` dont on connaît l'identifiant.
On ajoutera donc tout d'abord dans le contrôleur de `Person` une fonction qui va charger l'instance de la `Person` concernée au sein de l'objet représentant la requête courante (`req`) sous l'identifiant `person`.

Cette fonction `load_by_id` sera alors utilisée en tant que premier middleware dans la déclaration de toutes les routes citées ci-dessus.
Les fonctions du contrôleur `mailAddressCtrl` auront donc accès à l'instance de `Person` concernée dans le champ `req.person`.
On écrira dans ce contrôleur les fonctions `get_all, create, get_by_id, update_by_id, delete_by_id`.
