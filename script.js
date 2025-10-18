// Fare Matrix based on LGU Ordinance No. 536

// WITHIN MIDSAYAP TOWN PROPER (Short routes)
const townRoutes = {
    "Public Market-Crossing": { distance: 1.0, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Town Hall": { distance: 0.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Bus Terminal": { distance: 2.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 1": { distance: 0.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 2": { distance: 0.7, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 3": { distance: 1.0, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 4": { distance: 1.2, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 5": { distance: 1.4, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 6": { distance: 1.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 7": { distance: 1.3, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Pob 8": { distance: 1.1, baseRegular: 10.00, baseStudent: 8.00 },
    
    "Town Hall-Bus Terminal": { distance: 1.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 1": { distance: 0.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 2": { distance: 1.0, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 3": { distance: 1.3, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 4": { distance: 1.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 5": { distance: 1.7, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 6": { distance: 1.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 7": { distance: 1.6, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Pob 8": { distance: 1.4, baseRegular: 10.00, baseStudent: 8.00 },
    
    "Bus Terminal-Pob 1": { distance: 2.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 2": { distance: 2.3, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 3": { distance: 2.0, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 4": { distance: 1.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 5": { distance: 1.6, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 6": { distance: 1.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 7": { distance: 1.7, baseRegular: 10.00, baseStudent: 8.00 },
    "Bus Terminal-Pob 8": { distance: 1.9, baseRegular: 10.00, baseStudent: 8.00 },
};

// FROM TOWN PROPER TO OUTSIDE BARANGAYS
const outsideRoutes = {
    "Town Proper-Villarica": { distance: 4.30, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Sadaan": { distance: 2.60, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Kimagango": { distance: 3.73, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Anonang": { distance: 4.80, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-San Isidro": { distance: 1.56, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Bagumba": { distance: 2.56, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Agriculture": { distance: 1.15, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Bual": { distance: 2.45, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Glad": { distance: 2.49, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-River Side": { distance: 6.40, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Kiwanan": { distance: 2.83, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Proper-Aleosan": { distance: 5.94, baseRegular: 10.00, baseStudent: 8.00 }
};

let currentGasPrice = 50;

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
    const gasPriceInput = document.getElementById("gasPrice");
    let gasPrice = gasPriceInput.style.display === 'none' ? currentGasPrice : parseFloat(gasPriceInput.value);

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
    if (origin === destination) {
        showError("Origin and destination cannot be the same.");
        return;
    }
    if (!gasPrice || gasPrice < 30 || gasPrice > 109) {
        showError("Please select a valid gas price range.");
        return;
    }

    // Handle Poblacion to Poblacion routes
    if (origin.startsWith('Pob') && destination.startsWith('Pob')) {
        let fare = passengerType === 'student' ? 12.00 : 15.00;
        if (hasBaggage) {
            fare += 10.00;
        }

        document.getElementById("fareAmount").textContent = fare.toFixed(2);
        document.getElementById("routeInfo").textContent = `${origin} → ${destination}`;
        document.getElementById("distanceInfo").textContent = "N/A";
        document.getElementById("passengerInfo").textContent = passengerType === "student" ? "Student/PWD/Senior" : "Regular";
        document.getElementById("gasPriceInfo").textContent = "N/A";
        
        const baggageInfo = document.getElementById("baggageInfo");
        if (hasBaggage) {
            baggageInfo.style.display = "block";
        } else {
            baggageInfo.style.display = "none";
        }
        
        document.getElementById("result").classList.add("show");
        return;
    }

    // Check if route is within town or outside
    const routeKey = `${origin}-${destination}`;
    const reverseRouteKey = `${destination}-${origin}`;
    
    let route = townRoutes[routeKey] || townRoutes[reverseRouteKey];
    
    // If not found in town routes, check outside routes
    if (!route) {
        route = outsideRoutes[routeKey] || outsideRoutes[reverseRouteKey];
    }
    
    // If still not found, check if origin is a town location going outside
    if (!route) {
        const townLocations = ["NDMC", "Town Hall", "Public Market", "Crossing", "Bus Terminal", 
                              "Pob 1", "Pob 2", "Pob 3", "Pob 4", "Pob 5", "Pob 6", "Pob 7", "Pob 8"];
        
        if (townLocations.includes(origin)) {
            route = outsideRoutes[`Town Proper-${destination}`];
        } else if (townLocations.includes(destination)) {
            route = outsideRoutes[`Town Proper-${origin}`];
        }
    }
    
    if (!route) {
        showError("Route not found. Please select a valid route.");
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
    const gasPriceInput = document.getElementById("gasPrice");
    gasPriceInput.value = "50";
    gasPriceInput.style.display = 'none';
    document.getElementById("currentGasPrice").textContent = "50-59";
    currentGasPrice = 50;
    document.querySelector('input[name="passengerType"][value="student"]').checked = true;
    document.getElementById("hasBaggage").checked = false;
    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");
}

function toggleGasPriceInput() {
    const gasPriceInput = document.getElementById('gasPrice');
    const changePriceBtn = document.getElementById('changePriceBtn');

    if (gasPriceInput.style.display === 'none') {
        gasPriceInput.style.display = 'block';
        changePriceBtn.textContent = 'Done';
    } else {
        const newPrice = parseFloat(gasPriceInput.value);
        currentGasPrice = newPrice;
        const selectedOption = gasPriceInput.options[gasPriceInput.selectedIndex];
        document.getElementById('currentGasPrice').textContent = selectedOption.text;
        gasPriceInput.style.display = 'none';
        changePriceBtn.textContent = 'Change';
    }
}

function updateDestinations() {
    // No changes needed here for now
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
    document.getElementById('changePriceBtn').addEventListener('click', toggleGasPriceInput);
    document.getElementById('gasPrice').value = currentGasPrice;
    const selectedOption = document.getElementById('gasPrice').options[document.getElementById('gasPrice').selectedIndex];
    document.getElementById('currentGasPrice').textContent = selectedOption.text;
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