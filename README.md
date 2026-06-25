# SmartRoom

SmartRoom est une application moderne permettant à une entreprise de gérer efficacement l'ensemble de ses salles : réservation, disponibilité, équipements, statistiques d'utilisation.

> Equipe 1 \
> [Bastien RECORD](https://github.com/bastos-rcd) - [Alexandre LASSAIGNE](https://github.com/AlexandreLassaigne)

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
- **Backend** : NestJS, JWT
- **Base de données** : PostgreSQL
- **Déploiement** : Docker, Docker Compose

## Développement

1. Cloner le dépôt

   ```bash
   git clone https://github.com/bastos-rcd/SmartRoom.git
   cd SmartRoom
   ```

2. Installer les dépendances

   ```bash
   cd backend
   npm install

   cd frontend
   npm install
   ```

3. Démarrer la base de données

   ```bash
   docker-compose up -d db
   ```

4. Démarrer les services

   ```bash
   cd backend
   npm run start
   npm run test

   cd frontend
   npm run dev
   ```

5. Accéder à l'application via `http://localhost:5173`

6. Accéder à la documentation de l'API via `http://localhost:3000/docs`

## Production

1. Cloner le dépôt

   ```bash
   git clone https://github.com/bastos-rcd/SmartRoom.git
   cd SmartRoom
   ```

2. Démarrer l'application avec Docker Compose

   ```bash
   # Démarrer les services
   docker compose up -d
   ```

3. Accéder à l'application via `http://localhost:5173`

4. Accéder à la documentation de l'API via `http://localhost:3000/docs`

5. Arrêter l'application

   ```bash
   docker compose down
   ```

## Licence

Ce projet est sous licence [MIT](LICENSE)
