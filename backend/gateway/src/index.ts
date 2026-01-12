//point d'entrée qui démarre le serveur de la passerelle et centralise toutes les configurations globales
import express from 'express';
import cors from 'cors';
import { setupProxies } from './middlewares/proxyMiddleware';

const app = express();
const PORT = process.env.PORT || 8080;


// Autorise votre Front-end React (qui tourne sur le port 5173) à appeler le Gateway
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true // Si vous utilisez des cookies/sessions
}));


// Une petite route simple pour vérifier que le Gateway est en vie
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Gateway is running' });
});


// IMPORTANT : On place les proxies AVANT tout body-parser (express.json)
setupProxies(app);

// Note : On ne met PAS 'app.use(express.json())' ici globalement.
// Pourquoi ? Parce que le proxy doit faire passer le flux de données (stream)
// directement aux microservices sans essayer de le lire ou de le modifier.
// Chaque microservice (Auth, Room, Booking) aura son propre express.json().

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`
    ################################################
    🚀  API Gateway écoute sur le port : ${PORT}
    🔗  Proxy vers Auth Service     -> http://auth-service:3001
    🔗  Proxy vers Booking Service  -> http://booking-service:3002
    🔗  Proxy vers Room Service     -> http://room-service:3003
    ################################################
    `);
});