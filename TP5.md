# Groupes de personnes

## Entités

Ajouter l'entité suivante :
- `Group` : contient un champ `title`
    - une `Person` appartient à plusieurs `Group`
	- un `Group` appartient à plusieurs `Person`

## Routes

Ajouter au serveur HTTP la gestion des routes suivantes pour la gestion des groupes :
- `GET /group` : renvoie l'ensemble des groupes sous la forme d'un tableau d'objets en JSON
- `POST /group` : ajoute une nouvelle entité `Group` en base à partir des données fournies en JSON
- `GET /group/:group_id` : renvoie le groupe d'identifiant `group_id` sous la forme d'un objet en JSON
- `PUT /group/:group_id` : modifie le groupe d'identifiant `group_id` à partir des données fournies en JSON
- `DELETE /group/:group_id` : supprime le groupe d'identifiant `group_id`

Ajouter la définition des routes suivantes pour la gestion de l'association des groupes aux personnes :
- `GET /person/:person_id/group` : renvoie l'ensemble des groupes de la personne d'identifiant `person_id` sous la forme d'un tableau d'objets en JSON
- `GET /group/:group_id/person` : renvoie l'ensemble des personnes du groupe d'identifiant `group_id` sous la forme d'un tableau d'objets en JSON
- `POST /person/:person_id/group/:group_id` : ajoute le groupe d'identifiant `group_id` à la personne d'identifiant `person_id`
- `DELETE /person/:person_id/group/:group_id` : supprime le groupe d'identifiant `group_id` à la personne d'identifiant `person_id`

Les deux dernières routes peuvent éventuellement être doublées par des routes qui ont le même effet, mais en exprimant les choses dans l'autre sens (ajouter / supprimer une personne dans un groupe).
