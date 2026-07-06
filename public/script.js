document.addEventListener('DOMContentLoaded', () => {
    const verifyBtn = document.getElementById('verifyBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const statsBox = document.getElementById('statsBox');
    const statsContent = document.getElementById('statsContent');

    let mouseEvents = { moves: 0, clicks: 0 };
    let touchEvents = { touches: 0, support: 'ontouchstart' in window };

    // Track mouse events
    document.addEventListener('mousemove', () => mouseEvents.moves++);
    document.addEventListener('click', () => mouseEvents.clicks++);

    verifyBtn.addEventListener('click', async () => {
        loading.style.display = 'block';
        result.style.display = 'none';
        verifyBtn.disabled = true;

        try {
            const verificationData = await collectData();
            const botScore = calculateBotScore(verificationData);
            const status = getStatus(botScore);

            // Display result
            displayResult(result, botScore, status);
            displayStats(verificationData, botScore, status);

            // Send to server
            await sendVerificationData({
                ...verificationData,
                botScore,
                status,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Fehler:', error);
            result.innerHTML = `<div class="error">⚠️ Fehler bei der Verifizierung: ${error.message}</div>`;
            result.style.display = 'block';
        } finally {
            loading.style.display = 'none';
            verifyBtn.disabled = false;
        }
    });

    async function collectData() {
        const data = {
            // Verhaltensmuster
            mouseEvents: mouseEvents.clicks,
            mouseMoves: mouseEvents.moves,
            touchSupport: touchEvents.support,

            // Geräte-Information
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            deviceMemory: navigator.deviceMemory || 'N/A',
            processors: navigator.hardwareConcurrency || 'N/A',
            platform: navigator.platform,

            // Browser-Daten
            userAgent: navigator.userAgent,
            language: navigator.language,
            plugins: navigator.plugins.length,
            doNotTrack: navigator.doNotTrack,
            cookieEnabled: navigator.cookieEnabled,

            // Zeitzonen und Standort
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),

            // IP-Adresse via API
            ip: await getIP(),

            // Standort (falls erlaubt)
            location: await getLocation()
        };

        return data;
    }

    async function getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (e) {
            return 'N/A';
        }
    }

    async function getLocation() {
        return new Promise((resolve) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude.toFixed(4),
                            longitude: position.coords.longitude.toFixed(4),
                            accuracy: Math.round(position.coords.accuracy) + 'm'
                        });
                    },
                    () => resolve(null),
                    { timeout: 5000 }
                );
            } else {
                resolve(null);
            }
        });
    }

    function calculateBotScore(data) {
        let score = 50; // Basis-Score

        // Verhalten
        if (data.mouseEvents > 2) score += 15;
        if (data.mouseMoves > 10) score += 15;
        if (data.touchSupport) score += 10;

        // Geräte
        if (data.deviceMemory !== 'N/A' && data.deviceMemory >= 4) score += 10;
        if (data.processors !== 'N/A' && data.processors >= 2) score += 5;

        // Browser
        if (data.cookieEnabled) score += 5;
        if (data.plugins > 0) score += 5;

        // Reduziere bei verdächtigen Werten
        if (data.mouseMoves < 2) score -= 15;
        if (data.plugins === 0) score -= 5;

        return Math.max(0, Math.min(100, score));
    }

    function getStatus(botScore) {
        if (botScore >= 80) return 'PASS';
        if (botScore >= 60) return 'PASS';
        if (botScore >= 40) return 'SUSPICIOUS';
        return 'BOT';
    }

    function displayResult(element, botScore, status) {
        let statusIcon = status === 'PASS' ? '✅' : status === 'SUSPICIOUS' ? '⚠️' : '🚫';
        let statusText = status === 'PASS' ? 'Verifizierung erfolgreich!' : 'Verifizierung fehlgeschlagen!';
        let statusColor = status === 'PASS' ? 'success' : status === 'SUSPICIOUS' ? 'warning' : 'error';

        element.innerHTML = `
            <div class="result-card ${statusColor}">
                <h2>${statusIcon} ${statusText}</h2>
                <div class="bot-score">
                    <div class="score-value">${botScore}%</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${botScore}%"></div>
                    </div>
                </div>
                <p>Verifizierungsstatus: <strong>${status}</strong></p>
            </div>
        `;
        element.style.display = 'block';
    }

    function displayStats(data, botScore, status) {
        let html = `
            <div class="stats-grid">
                <div class="stat">
                    <strong>Bot-Score:</strong> ${botScore}%
                </div>
                <div class="stat">
                    <strong>Status:</strong> ${status}
                </div>
                <div class="stat">
                    <strong>Zeitzone:</strong> ${data.timezone}
                </div>
                <div class="stat">
                    <strong>IP-Adresse:</strong> ${data.ip}
                </div>
                <div class="stat">
                    <strong>Plattform:</strong> ${data.platform}
                </div>
                <div class="stat">
                    <strong>Sprache:</strong> ${data.language}
                </div>
                <div class="stat">
                    <strong>Bildschirm:</strong> ${data.screenResolution}
                </div>
                <div class="stat">
                    <strong>Mausklicks:</strong> ${data.mouseEvents}
                </div>
        `;

        if (data.location) {
            html += `
                <div class="stat">
                    <strong>Standort:</strong> ${data.location.latitude}, ${data.location.longitude} (±${data.location.accuracy})
                </div>
            `;
        }

        html += '</div>';
        statsContent.innerHTML = html;
        statsBox.style.display = 'block';
    }

    async function sendVerificationData(data) {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Fehler beim Speichern der Verifizierungsdaten');
            }

            const result = await response.json();
            console.log('✓ Daten gespeichert:', result);
        } catch (error) {
            console.error('Fehler beim Senden der Daten:', error);
            // Fehler wird nicht angezeigt, da Verifizierung auch ohne Server funktioniert
        }
    }
});
