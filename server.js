const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-Memory Datenbank (verwende eine echte DB für Produktion!)
const verifications = [];
const dashboardToken = process.env.DASHBOARD_TOKEN || 'admin123'; // Ändern Sie dies!

// ===== API ENDPOINTS =====

// Verifizierungsdaten speichern
app.post('/api/verify', (req, res) => {
    const data = req.body;
    
    const entry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        botScore: data.botScore,
        status: data.status,
        ip: req.ip || 'Unknown',
        userAgent: req.get('user-agent'),
        data: data
    };
    
    verifications.push(entry);
    console.log('✓ Neue Verifizierung gespeichert:', entry.id);
    
    res.json({ 
        success: true, 
        id: entry.id,
        message: 'Verifizierung erfolgreich gespeichert'
    });
});

// Dashboard - Alle Verifizierungen abrufen (mit Token-Schutz)
app.get('/api/dashboard/verifications', (req, res) => {
    const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (token !== dashboardToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.json({
        total: verifications.length,
        data: verifications.reverse()
    });
});

// Dashboard - Statistiken
app.get('/api/dashboard/stats', (req, res) => {
    const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (token !== dashboardToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const botCount = verifications.filter(v => v.status === 'BOT').length;
    const legitCount = verifications.filter(v => v.status === 'PASS').length;
    const suspiciousCount = verifications.filter(v => v.status === 'SUSPICIOUS').length;
    
    const avgBotScore = verifications.length > 0 
        ? (verifications.reduce((sum, v) => sum + v.botScore, 0) / verifications.length).toFixed(2)
        : 0;
    
    res.json({
        total: verifications.length,
        botCount,
        legitCount,
        suspiciousCount,
        avgBotScore
    });
});

// Dashboard - Verifizierung löschen (optional)
app.delete('/api/dashboard/verifications/:id', (req, res) => {
    const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (token !== dashboardToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const index = verifications.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        verifications.splice(index, 1);
        res.json({ success: true, message: 'Gelöscht' });
    } else {
        res.status(404).json({ error: 'Nicht gefunden' });
    }
});

// HTML Seiten
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Server starten
app.listen(PORT, () => {
    console.log(`\n🚀 Server läuft auf http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔐 Dashboard Token: ${dashboardToken}\n`);
});
