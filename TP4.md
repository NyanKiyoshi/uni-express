# Nouvelles entités

## Modèles

Ajouter au modèle de données les entités suivantes :
- `PostalAddress` : contient des champs décrivant une adresse postale et un type qui peut prendre une valeur dans la liste suivante : 'home', 'work'
    - une `PostalAddress` appartient à une `Person`
	- une `Person` dispose de plusieurs `PostalAddress`
	- les `PostalAddress` sont supprimées avec la `Person`
- `Phone` : contient un champ décrivant un numéro de téléphone et un type qui peut prendre une valeur dans la liste suivante : 'home', 'work'
    - un `Phone` appartient à une `Person`
	- une `Person` dispose de plusieurs `Phone`
	- les `Phone` sont supprimés avec la `Person`

## Contrôleurs

Créer les contrôleurs offrant les méthodes pour manipuler ces entités (sur le même modèle que le contrôleur de `MailAddress`).

## Routes

Ajouter les définitions de routes correspondantes.

# Filtrage

Ajouter la possibilité de filtrer la récupération des entités `MailAddress`, `PostalAddress` et `Phone` en fonction de la valeur de leur champ `type`.
Pour cela, on ajoutera la gestion d'un attribut `type` dans la query string des routes du type `GET /person/:person_id/mailAddress`.
Si cet attribut est présent, on ne renverra que les entités du type correspondant.

Ajouter la possibilité de filtrer la récupération des `Person` en fonction de leur nom.
Pour cela, on ajoutera la gestion d'un attribut `lastname` dans la query string de la route `GET /person`.
Si cet attribut est présent, on ne renverra que les entités dont l'attribut `lastname` contient la chaîne fournie.
