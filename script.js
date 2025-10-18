// Fare Matrix based on LGU Ordinance No. 536
// Base fares for first 2km from Midsayap Town Proper
const fareMatrix = {
    "Villarica": { distance: 4.30, baseRegular: 10.00, baseStudent: 8.00 },
    "Sadaan": { distance: 2.60, baseRegular: 10.00, baseStudent: 8.00 },
    "Kimagango": { distance: 3.73, baseRegular: 10.00, baseStudent: 8.00 },
    "Anonang": { distance: 4.80, baseRegular: 10.00, baseStudent: 8.00 },
    "San Isidro": { distance: 1.56, baseRegular: 10.00, baseStudent: 8.00 },
    "Bagumba": { distance: 2.56, baseRegular: 10.00, baseStudent: 8.00 },
    "Agriculture": { distance: 1.15, baseRegular: 10.00, baseStudent: 8.00 },
    "Bual": { distance: 2.45, baseRegular: 10.00, baseStudent: 8.00 },
    "Glad": { distance: 2.49, baseRegular: 10.00, baseStudent: 8.00 },
    "River Side": { distance: 6.40, baseRegular: 10.00, baseStudent: 8.00 },
    "Kiwanan": { distance: 2.83, baseRegular: 10.00, baseStudent: 8.00 },
    "Aleosan": { distance: 5.94, baseRegular: 10.00, baseStudent: 8.00 }
};

// Gas price tiers based on Ordinance No. 536
function getFareByGasPrice(gasPrice, baseRegular, baseStudent, passengerType) {
    let multiplier = 1.0;
    
    // Determine fare based on gas price tiers
    if (gasPrice >= 110) {
        multiplier = 2.1; // ₱21.00 regular, ₱16.80 student
    } else if (gasPrice >= 100) {
        multiplier = 1.9; // ₱19.00 regular, ₱15.20 student
    } else if (gasPrice >= 90) {
        multiplier = 1.7; // ₱17.00 regular, ₱13.60 student
    } else if (gasPrice >= 80) {
        multiplier = 1.5; // ₱15.00 regular, ₱12.00 student
    } else if (gasPrice >= 70) {
        multiplier = 1.3; // ₱13.00 regular, ₱10.40 student
    } else if (gasPrice >= 60) {
        multiplier = 1.2; // ₱12.00 regular, ₱9.60 student
    } else if (gasPrice >= 50) {
        multiplier = 1.1; // ₱11.00 regular, ₱8.80 student
    } else {
        multiplier = 1.0; // ₱10.00 regular, ₱8.00 student
    }
    
    if (passengerType === "student") {
        return baseStudent * multiplier;
    } else {
        return baseRegular * multiplier;
    }
}

function calculateFare() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const gasPrice = parseFloat(document.getElementById("gasPrice").value);
    const passengerType = document.querySelector('input[name="passengerType"]:checked').value;
    const hasBaggage = document.getElementById("hasBaggage").checked;

    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");

    // Validation
    if (!origin) {
        showError("Please select an origin.");
        return;
    }
    if (!destination) {
        showError("Please select a destination.");
        return;
    }
    if (!gasPrice || gasPrice < 30 || gasPrice > 120) {
        showError("Please enter a valid gas price (₱30-₱120 per liter).");
        return;
    }

    const route = fareMatrix[destination];
    if (!route) {
        showError("Route not found. Please select a valid destination.");
        return;
    }

    // Calculate base fare for first 2km
    let fare = getFareByGasPrice(gasPrice, route.baseRegular, route.baseStudent, passengerType);
    
    // Add ₱2.00 per km after first 2km (as per Section 1 of Ordinance)
    if (route.distance > 2) {
        const additionalKm = route.distance - 2;
        fare += additionalKm * 2.00;
    }

    // Add baggage fee if selected
    let baggageFee = 0;
    if (hasBaggage) {
        baggageFee = 10.00;
        fare += baggageFee;
    }

    // Display results
    document.getElementById("fareAmount").textContent = fare.toFixed(2);
    document.getElementById("routeInfo").textContent = `${origin} → ${destination}`;
    document.getElementById("distanceInfo").textContent = route.distance.toFixed(2);
    document.getElementById("passengerInfo").textContent = passengerType === "student" ? "Student/PWD/Senior" : "Regular";
    document.getElementById("gasPriceInfo").textContent = gasPrice.toFixed(2);
    
    // Show/hide baggage info
    const baggageInfo = document.getElementById("baggageInfo");
    if (hasBaggage) {
        baggageInfo.style.display = "block";
    } else {
        baggageInfo.style.display = "none";
    }
    
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
    document.getElementById("hasBaggage").checked = false;
    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");
}

// PWA Functionality
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