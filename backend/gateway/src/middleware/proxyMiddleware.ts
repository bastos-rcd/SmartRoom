//règles d'aiguillage pour rediriger intelligemment chaque requête du front-end vers le bon microservice (auth, room ou booking).import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const setupProxies = (app: Application) => {


    app.use('/api/auth', createProxyMiddleware({
        target: 'http://auth-service:3001', // Nom du service dans docker-compose
        changeOrigin: true, // Nécessaire pour les vhosts virtuels
        pathRewrite: {
            '^/api/auth': '', // Enlève '/api/auth' de l'URL avant de l'envoyer
        },
        // Optionnel : Logs pour voir ce qui se passe
        onProxyReq: (proxyReq, req, res) => {
            console.log(`[Auth] Proxying ${req.method} request to: ${proxyReq.path}`);
        }
    }));


    app.use('/api/bookings', createProxyMiddleware({
        target: 'http://booking-service:3002',
        changeOrigin: true,
        pathRewrite: {
            '^/api/bookings': '', 
        },
    }));


    app.use('/api/rooms', createProxyMiddleware({
        target: 'http://room-service:3003',
        changeOrigin: true,
        pathRewrite: {
            '^/api/rooms': '',
        },
    }));
};