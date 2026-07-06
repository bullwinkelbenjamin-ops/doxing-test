# Bot-Verifizierung mit CAPTCHA

Eine vollständig konfigurationsfreie Web-Anwendung zur Verifizierung von Benutzern und Bot-Erkennung. 

## 🚀 Features

✓ **Keine Konfiguration notwendig** - Funktioniert sofort nach dem Öffnen  
✓ **Bot-Erkennung** - Intelligente Verhaltensanalyse  
✓ **Standortverfolgung** - Optionale GPS-Lokalisierung  
✓ **IP-Adresse Erfassung** - Automatische IP-Erkennung  
✓ **Geräte-Info** - Bildschirm, Plattform, Sprache, etc.  
✓ **Responsive Design** - Funktioniert auf allen Geräten  
✓ **Schöne UI** - Modernes Design mit Animationen  

## 🎯 Verwendung

Öffne einfach `index.html` im Browser - **Keine Installation erforderlich!**

```bash
# Option 1: Direkt im Browser öffnen
file:///path/to/index.html

# Option 2: Mit lokalem Server
python -m http.server 8000
# Dann öffnen: http://localhost:8000
```

## 📊 Was wird erfasst?

Wenn du auf "Verifizieren" klickst, wird folgendes analysiert:

### 🔍 Verhaltensmuster
- Mausbewegungen
- Klick-Timing
- Touch-Support
- Browser-Fonts

### 📱 Geräte-Information
- Bildschirmauflösung
- Bildschirmfarb-Tiefe
- Gerätespeicher
- Prozessor-Kerne
- Plattform (Windows/Mac/Linux)

### 🌍 Standort & Netzwerk
- IP-Adresse
- GPS-Koordinaten (wenn erlaubt)
- Standort-Genauigkeit
- Zeitzone

### 🔐 Browser-Daten
- User Agent
- Sprache
- Installierte Plugins
- Geolocation-Support

## 📈 Bot-Score Berechnung

Der System berechnet einen Score von 0-100%:

| Score | Bedeutung |
|-------|-----------|
| **80-100%** | ✅ Sehr wahrscheinlich legitim |
| **60-79%** | ✅ Wahrscheinlich legitim |
| **40-59%** | ⚠️ Verdächtig |
| **0-39%** | 🚫 Wahrscheinlich Bot |

## 🔐 Sicherheit & Datenschutz

⚠️ **WICHTIG**: Dieses System erfasst persönliche Daten:
- GPS-Standort (mit Benutzer-Zustimmung)
- IP-Adresse
- Browser-Fingerprint
- Verhaltensmuster

**Beachte für den Produktionseinsatz:**
- ✓ Datenschutzerklärung bereitstellen
- ✓ Benutzer klar informieren
- ✓ GDPR/CCPA Compliance sicherstellen
- ✓ Daten nur so lange speichern wie nötig
- ✓ SSL/HTTPS verwenden
- ✓ Sichere Datenbank für Logs

## 📁 Dateistruktur

```
.
├── index.html      # Hauptseite (öffne diese!)
├── style.css       # Styling
├── script.js       # Verifizierungslogik
├── README.md       # Diese Datei
├── server.js       # Optional: Node.js Backend
└── package.json    # Optional: NPM Dependencies
```

## 💻 Browser-Kompatibilität

| Browser | Status |
|---------|--------|
| Chrome/Chromium | ✓ Vollständig |
| Firefox | ✓ Vollständig |
| Safari | ✓ Vollständig |
| Edge | ✓ Vollständig |
| Opera | ✓ Vollständig |
| IE 11 | ✗ Nicht unterstützt |

## 🎨 Anpassungen

Du kannst die Datei `style.css` anpassen:

```css
/* Farben ändern */
body {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Font wechseln */
body {
    font-family: 'Deine Font', sans-serif;
}
```

## 🧪 Testen

1. Öffne `index.html`
2. Klicke auf "Verifizieren"
3. Warte auf die Verifizierung (ca. 1-2 Sekunden)
4. Erlaube oder verweigere Standortzugriff
5. Sehe die Ergebnisse mit allen erfassten Daten

## 📝 Beispiel-Output

```
✓ Verifizierung erfolgreich!

Bot-Score: 85%
Verifizierungsstatus: PASS

Zeitstempel: 06.07.2026, 18:45:30
Zeitzone: Europe/Berlin
IP-Adresse: 192.168.1.1
Bildschirmauflösung: 1920 x 1080
Plattform: Linux
Sprache: de-DE

📍 Standort:
Breitengrad: 52.5200
Längengrad: 13.4050
Genauigkeit: 65m
```

## 🚀 Erweiterte Verwendung

### Mit Node.js Server

Falls du ein Backend haben möchtest:

```bash
npm install
npm start
```

Dann öffne: `http://localhost:3000`

### Mit Datenbank

Der `server.js` speichert alle Verifizierungen im RAM. Für Produktion:

```javascript
// In server.js: Datenbank-Integration hinzufügen
const db = require('your-database');
// Speichere logEntry in der Datenbank
```

## ❓ FAQ

**F: Funktioniert es offline?**  
A: Ja, aber die IP-Adresse kann nicht ermittelt werden.

**F: Speichert ihr meine Daten?**  
A: Nein, die Demo speichert nichts. Der `server.js` speichert im RAM (wird gelöscht beim Neustart).

**F: Wie genau ist der Bot-Score?**  
A: Ca. 70-80% Genauigkeit. Für produktive Systeme reCAPTCHA oder ähnliche Services nutzen.

**F: Kann ich das anpassen?**  
A: Ja! Änder `script.js` und `style.css` nach Belieben.

## 📞 Support

Für Fragen oder Bugs: Erstelle ein Issue im Repository

## 📄 Lizenz

MIT

---

**Viel Spaß beim Testen! 🎉**
