# SmartRoom

SmartRoom est une application moderne permettant à une entreprise de gérer efficacement l'ensemble de ses salles : réservation, disponibilité, équipements, statistiques d'utilisation.

> Equipe 1 \
> [Bastien RECORD](https://github.com/bastos-rcd) - [Alexandre LASSAIGNE](https://github.com/AlexandreLassaigne) - [Cassam Barakatally MAHADAWOO](https://github.com/Ecmosplasmidou)

## Fonctionnalités

### Gestion des salles

- Localisation des salles
- Equipements (vidéo-projecteur, tableau blanc, audio, etc.)
- Capacité
- Disponibilité en temps réel

### Réservation

- Recherche par date, heure, capacité, équipements
- Réservation simple et rapide
- Modification / annulation
- Vue calendrier / planning / liste

### Notifications

- Confirmation de réservation
- Rappel automatique
- Annulation / modification

### Statistiques

- Taux d'occupation
- Nombre de réservations
- Pics d'utilisation
- Rapports pour administrateurs

### Gestion des droits

- Utilisateurs standard
- Administrateurs

## Technologies

- **Frontend** : React, Bootstrap
- **Backend** : Node.js, Express, Prisma, JWT
- **Base de données** : PostgreSQL
- **Déploiement** : Docker, Docker Compose

## Installation

1. Cloner le dépôt

   ```bash
   git clone https://github.com/bastos-rcd/SmartRoom.git
   cd SmartRoom
   ```

2. Démarrer l'application avec Docker Compose

   ```bash
   # Installer les dépendances en local si nécessaire
   npm install
   # Mode production
   docker compose -f docker-compose.prod.yml up -d
   # Mode développement
   docker compose -f docker-compose.dev.yml up -d
   ```

3. Accéder à l'application via `http://localhost:5173`

4. Arrêter l'application

   ```bash
   # Mode production
   docker compose -f docker-compose.prod.yml down
   # Mode développement
   docker compose -f docker-compose.dev.yml down
   ```

## Licence

Ce projet est sous licence [MIT](LICENSE)
