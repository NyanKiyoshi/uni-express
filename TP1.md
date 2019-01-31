# Introduction

On va écrire une application Node.js qui expose des routes HTTP qui vont permettre gérer des entités stockées en base de données.

En premier lieu, créer une nouvelle application Node.js grâce à la commande `npm init`.

Installer les dépendances (et enregistrer l'information dans le package.json au passage) :
```sh
npm install --save express body-parser sequelize mysql2
```

`express` permet de créer un serveur HTTP, `body-parser` de récupérer les données transmises par le client avec une requête et `sequelize` est la bibliothèque qui va nous servir à gérer le lien avec la BDD. C'est ce qu'on appelle un ORM (Object Relational Mapper). Sa documentation est accessible à l'adresse : http://docs.sequelizejs.com/

# Exercices

- Créer une base de données "W4a"

- Ecrire une application Node.js qui :
    - crée un objet `sequelize` connecté à votre base "W4a"
    - définit une entité Sequelize (modèle) `Person` ayant des champs `firstname` et `lastname`
    - synchronise la base avec l'entité définie
    - crée un serveur HTTP `express`
    - enregistre les routes HTTP suivantes :
        - `GET /person` : renvoie l'ensemble des personnes sous la forme d'un tableau d'objets en JSON
        - `POST /person` : ajoute une nouvelle entité `Person` en base à partir des données fournies en JSON
        - `GET /person/:person_id` : renvoie la personne d'identifiant `person_id` sous la forme d'un objet en JSON
        - `PUT /person/:person_id` : modifie la personne d'identifiant `person_id` à partir des données fournies en JSON
        - `DELETE /person/:person_id` : supprime la personne d'identifiant `person_id`
    - ajoute un middleware de gestion d'erreur qui reçoit un objet contenant le statut et le texte de la réponse d'erreur à renvoyer
	- lance l'écoute du serveur HTTP sur un port choisi

L'ensemble des fonctions qui font appel à l'entité Sequelize `Person` seront définies au sein d'un objet `personCtrl`.
On écrira les fonctions `get_all, create, get_by_id, update_by_id, delete_by_id`.

L'ensemble de ces routes seront testées grâce à l'outil Postman.
