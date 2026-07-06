// Bot-Verifizierungssystem
class CaptchaVerification {
    constructor() {
        this.verifyBtn = document.getElementById('verifyBtn');
        this.loading = document.getElementById('loading');
        this.result = document.getElementById('result');
        this.statsBox = document.getElementById('statsBox');
        this.statsContent = document.getElementById('statsContent');
        
        this.verificationData = {
            timestamp: null,
            userAgent: navigator.userAgent,
            ipAddress: null,
            location: null,
            isVerified: false,
            botScore: 0,
            verificationMethod: 'behavioral_analysis',
            screenInfo: null,
            timezone: null
        };
        
        this.init();
    }
    
    init() {
        this.verifyBtn.addEventListener('click', () => this.startVerification());
    }
    
    async startVerification() {
        this.verifyBtn.disabled = true;
        this.loading.style.display = 'block';
        this.result.style.display = 'none';
        this.statsBox.style.display = 'none';
        
        try {
            // Schritt 1: Erfasse Geräte- und Umgebungsinformationen
            this.verificationData.timestamp = new Date().toISOString();
            this.captureDeviceInfo();
            this.captureScreenInfo();
            this.captureTimezone();
            
            // Schritt 2: Analysiere Verhalten
            const behaviorScore = await this.analyzeBehavior();
            
            // Schritt 3: Versuche IP-Adresse zu ermitteln
            await this.getIPAddress();
            
            // Schritt 4: Versuche Standort zu ermitteln (mit Berechtigungsprüfung)
            await this.getLocation();
            
            // Schritt 5: Berechne finalen Bot-Score
            this.calculateBotScore(behaviorScore);
            
            // Schritt 6: Zeige Ergebnis
            this.showSuccess();
            
        } catch (error) {
            console.error('Verifizierungsfehler:', error);
            this.showError('Ein Fehler ist aufgetreten: ' + error.message);
        }
    }
    
    captureDeviceInfo() {
        this.verificationData.screenInfo = {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio
        };
        console.log('Geräte-Info erfasst:', this.verificationData.screenInfo);
    }
    
    captureScreenInfo() {
        this.verificationData.screenInfo = {
            ...this.verificationData.screenInfo,
            language: navigator.language,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency || 'Unbekannt',
            deviceMemory: navigator.deviceMemory || 'Unbekannt'
        };
    }
    
    captureTimezone() {
        this.verificationData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
    async analyzeBehavior() {
        // Simuliere Verhaltensanalyse
        // In einem echten System würde dies Mausbewegungen, Klickmuster etc. analysieren
        return new Promise((resolve) => {
            setTimeout(() => {
                // Zufälliger Score basierend auf verschiedenen Faktoren
                const factors = {
                    mouseMovement: Math.random() * 0.3,
                    clickTiming: Math.random() * 0.2,
                    touchSupport: navigator.maxTouchPoints > 0 ? 0.3 : 0,
                    fonts: Math.random() * 0.2
                };
                
                const score = (factors.mouseMovement + factors.clickTiming + factors.touchSupport + factors.fonts) / 4;
                console.log('Verhaltensanalyse abgeschlossen:', score);
                resolve(score);
            }, 800);
        });
    }
    
    async getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json', {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            this.verificationData.ipAddress = data.ip;
            console.log('IP-Adresse erfasst:', data.ip);
        } catch (error) {
            console.warn('IP-Adresse konnte nicht ermittelt werden:', error);
            this.verificationData.ipAddress = 'Nicht verfügbar';
        }
    }
    
    async getLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.verificationData.location = {
                            latitude: position.coords.latitude.toFixed(4),
                            longitude: position.coords.longitude.toFixed(4),
                            accuracy: Math.round(position.coords.accuracy) + 'm',
                            altitude: position.coords.altitude ? Math.round(position.coords.altitude) + 'm' : 'N/A'
                        };
                        console.log('Standort erfasst:', this.verificationData.location);
                        resolve();
                    },
                    (error) => {
                        console.warn('Standortberechtigung verweigert:', error);
                        this.verificationData.location = {
                            status: 'Berechtigung verweigert',
                            message: 'Benutzer hat Standortzugriff nicht gewährt'
                        };
                        resolve();
                    },
                    { 
                        timeout: 5000,
                        enableHighAccuracy: false
                    }
                );
            } else {
                console.warn('Geolocation wird nicht unterstützt');
                this.verificationData.location = {
                    status: 'Nicht unterstützt',
                    message: 'Geolocation wird von diesem Browser nicht unterstützt'
                };
                resolve();
            }
        });
    }
    
    calculateBotScore(behaviorScore) {
        // Kombiniere verschiedene Faktoren zu einem finalen Score
        // 0.0 = Sicher Bot, 1.0 = Sicher legit
        
        let factors = [behaviorScore];
        
        // Faktor: Touch-Support (Bots unterstützen normalerweise kein Touch)
        factors.push(navigator.maxTouchPoints > 0 ? 0.8 : 0.3);
        
        // Faktor: User Agent Länge
        factors.push(Math.min(navigator.userAgent.length / 200, 1.0));
        
        // Faktor: Plugins
        factors.push(navigator.plugins.length > 0 ? 0.7 : 0.4);
        
        const averageScore = factors.reduce((a, b) => a + b, 0) / factors.length;
        this.verificationData.botScore = Math.round(averageScore * 100);
        this.verificationData.isVerified = this.verificationData.botScore > 50;
        
        console.log('Bot Score berechnet:', this.verificationData.botScore);
    }
    
    showSuccess() {
        const isLikelyBot = this.verificationData.botScore < 50;
        const scoreClass = this.verificationData.botScore > 70 ? 'high' : (this.verificationData.botScore > 40 ? 'medium' : 'low');
        
        this.result.innerHTML = `
            <div class="result ${this.verificationData.isVerified ? 'success' : 'warning'}">
                ${this.verificationData.isVerified ? '✓ Verifizierung erfolgreich!' : '⚠ Verdächtige Aktivität erkannt'}
                ${isLikelyBot ? '<br><small>Warnung: Mögliches Bot-Verhalten erkannt</small>' : ''}
            </div>
        `;
        this.result.style.display = 'block';
        
        this.displayStats();
    }
    
    displayStats() {
        const locationHTML = this.verificationData.location && this.verificationData.location.latitude
            ? `<div class="location-info">
                <strong>📍 Standort:</strong>
                <p>Breitengrad: <strong>${this.verificationData.location.latitude}</strong></p>
                <p>Längengrad: <strong>${this.verificationData.location.longitude}</strong></p>
                <p>Genauigkeit: <strong>${this.verificationData.location.accuracy}</strong></p>
                <p>Höhe: <strong>${this.verificationData.location.altitude}</strong></p>
              </div>`
            : `<div class="location-info">
                <strong>📍 Standort:</strong>
                <p>${this.verificationData.location?.status || 'Nicht verfügbar'}</p>
              </div>`;
        
        const scoreLevel = this.verificationData.botScore > 70 ? '✅ Legitim' : (this.verificationData.botScore > 40 ? '⚠️ Verdächtig' : '🚫 Wahrscheinlich Bot');
        
        this.statsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Bot-Score</h3>
                    <div class="value">${this.verificationData.botScore}%</div>
                    <div class="bot-score">
                        <div class="score-bar">
                            <div class="score-fill ${this.verificationData.botScore > 70 ? '' : (this.verificationData.botScore > 40 ? 'medium' : 'low')}" style="width: ${this.verificationData.botScore}%">
                                ${this.verificationData.botScore}%
                            </div>
                        </div>
                        <small>${scoreLevel}</small>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3>Verifizierungsstatus</h3>
                    <div class="value">${this.verificationData.isVerified ? '✓ PASS' : '✗ FAIL'}</div>
                </div>
            </div>
            
            <div class="info-grid" style="margin-top: 20px;">
                <div class="info-item">
                    <strong>🕐 Zeitstempel</strong>
                    <span>${new Date(this.verificationData.timestamp).toLocaleString('de-DE')}</span>
                </div>
                
                <div class="info-item">
                    <strong>🌍 Zeitzone</strong>
                    <span>${this.verificationData.timezone}</span>
                </div>
                
                <div class="info-item">
                    <strong>🌐 IP-Adresse</strong>
                    <span>${this.verificationData.ipAddress}</span>
                </div>
                
                <div class="info-item">
                    <strong>📱 Bildschirmauflösung</strong>
                    <span>${this.verificationData.screenInfo.width} x ${this.verificationData.screenInfo.height}</span>
                </div>
                
                <div class="info-item">
                    <strong>🖥️ Plattform</strong>
                    <span>${this.verificationData.screenInfo.platform}</span>
                </div>
                
                <div class="info-item">
                    <strong>🌐 Sprache</strong>
                    <span>${this.verificationData.screenInfo.language}</span>
                </div>
            </div>
            
            ${locationHTML}
            
            <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666;">
                <strong>User Agent:</strong><br>
                <code style="word-break: break-all; color: #333;">${this.verificationData.userAgent}</code>
            </div>
        `;
        
        this.statsBox.style.display = 'block';
        this.loading.style.display = 'none';
    }
    
    showError(message) {
        this.result.innerHTML = `
            <div class="result error">
                ✗ ${message}
            </div>
        `;
        this.result.style.display = 'block';
        this.loading.style.display = 'none';
        this.verifyBtn.disabled = false;
    }
}

// Initialisiere die Anwendung wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new CaptchaVerification();
});
