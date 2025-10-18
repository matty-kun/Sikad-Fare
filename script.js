const fareMatrix = [
    { origin: "NDMC", destination: "Public Market", baseDistance: 1.5, baseFareStudent: 15, baseFareRegular: 20 },
    { origin: "NDMC", destination: "Crossing", baseDistance: 2.0, baseFareStudent: 17, baseFareRegular: 22 },
    { origin: "NDMC", destination: "City Hall", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "NDMC", destination: "Bus Terminal", baseDistance: 3.0, baseFareStudent: 22, baseFareRegular: 28 },
    { origin: "Public Market", destination: "NDMC", baseDistance: 1.5, baseFareStudent: 15, baseFareRegular: 20 },
    { origin: "Public Market", destination: "Crossing", baseDistance: 1.0, baseFareStudent: 12, baseFareRegular: 15 },
    { origin: "Public Market", destination: "City Hall", baseDistance: 1.5, baseFareStudent: 15, baseFareRegular: 20 },
    { origin: "Public Market", destination: "Bus Terminal", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "Crossing", destination: "NDMC", baseDistance: 2.0, baseFareStudent: 17, baseFareRegular: 22 },
    { origin: "Crossing", destination: "Public Market", baseDistance: 1.0, baseFareStudent: 12, baseFareRegular: 15 },
    { origin: "Crossing", destination: "City Hall", baseDistance: 1.2, baseFareStudent: 13, baseFareRegular: 17 },
    { origin: "Crossing", destination: "Bus Terminal", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "City Hall", destination: "NDMC", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "City Hall", destination: "Public Market", baseDistance: 1.5, baseFareStudent: 15, baseFareRegular: 20 },
    { origin: "City Hall", destination: "Crossing", baseDistance: 1.2, baseFareStudent: 13, baseFareRegular: 17 },
    { origin: "City Hall", destination: "Bus Terminal", baseDistance: 1.8, baseFareStudent: 17, baseFareRegular: 22 },
    { origin: "Bus Terminal", destination: "NDMC", baseDistance: 3.0, baseFareStudent: 22, baseFareRegular: 28 },
    { origin: "Bus Terminal", destination: "Public Market", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "Bus Terminal", destination: "Crossing", baseDistance: 2.5, baseFareStudent: 20, baseFareRegular: 25 },
    { origin: "Bus Terminal", destination: "City Hall", baseDistance: 1.8, baseFareStudent: 17, baseFareRegular: 22 }
];

function calculateFare() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const gasPrice = parseFloat(document.getElementById("gasPrice").value);
    const passengerType = document.querySelector('input[name="passengerType"]:checked').value;

    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");

    if (!origin) {
        showError("Please select an origin.");
        return;
    }
    if (!destination) {
        showError("Please select a destination.");
        return;
    }
    if (origin === destination) {
        showError("Origin and destination cannot be the same.");
        return;
    }
    if (!gasPrice || gasPrice < 50 || gasPrice > 150) {
        showError("Please enter a valid gas price (₱50-₱150 per liter).");
        return;
    }

    const route = fareMatrix.find(r => r.origin === origin && r.destination === destination);

    if (!route) {
        showError("Route not found. This route may not be available yet.");
        return;
    }

    let fare = 0;
    
    if (passengerType === "student") {
        fare = route.baseFareStudent;
    } else {
        fare = route.baseFareRegular;
    }

    if (gasPrice > 80) {
        fare += 5;
    } else if (gasPrice > 70) {
        fare += 2;
    }

    document.getElementById("fareAmount").textContent = fare.toFixed(2);
    document.getElementById("routeInfo").textContent = `${origin} → ${destination}`;
    document.getElementById("distanceInfo").textContent = route.baseDistance.toFixed(1);
    document.getElementById("passengerInfo").textContent = passengerType === "student" ? "Student" : "Regular";
    document.getElementById("gasPriceInfo").textContent = gasPrice.toFixed(2);
    document.getElementById("result").classList.add("show");
}

function showError(message) {
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = message;
    errorDiv.classList.add("show");
}

function resetForm() {
    document.getElementById("origin").value = "";
    document.getElementById("destination").value = "";
    document.getElementById("gasPrice").value = "";
    document.querySelector('input[name="passengerType"][value="student"]').checked = true;
    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').style.display = 'block';
});

document.getElementById('installButton').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }
});

document.getElementById('dismissButton').addEventListener('click', () => {
    document.getElementById('installPrompt').style.display = 'none';
});

window.addEventListener('appinstalled', () => {
    document.getElementById('installPrompt').style.display = 'none';
});

window.addEventListener('load', () => {
    updateOnlineStatus();
});

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (navigator.onLine) {
        offlineIndicator.style.display = 'none';
    } else {
        offlineIndicator.style.display = 'block';
    }
}