// Fare Matrix based on LGU Ordinance No. 536 (Updated October 2025)

// WITHIN MIDSAYAP TOWN PROPER (Short routes)
const townRoutes = {
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
};

// OUTSIDE BARANGAYS BASED ON ORDINANCE NO. 536
const outsideRoutes = {
    "Town Proper-Villarica": { distance: 4.30, baseRegular: 25.00, baseStudent: 21.60 },
    "Town Proper-Sadaan": { distance: 3.56, baseRegular: 18.00, baseStudent: 14.76 },
    "Town Proper-Kimagango": { distance: 5.21, baseRegular: 29.00, baseStudent: 23.20 },
    "Town Proper-Anonang": { distance: 8.50, baseRegular: 30.00, baseStudent: 25.60 },
    "Town Proper-San Isidro": { distance: 3.63, baseRegular: 24.00, baseStudent: 19.20 },
    "Town Proper-Bagumba": { distance: 4.48, baseRegular: 18.00, baseStudent: 16.80 },
    "Town Proper-Agriculture": { distance: 5.01, baseRegular: 25.00, baseStudent: 20.00 },
    "Town Proper-Bual": { distance: 2.96, baseRegular: 20.00, baseStudent: 16.40 },
    "Town Proper-River Side": { distance: 11.43, baseRegular: 25.00, baseStudent: 20.50 },
    "Town Proper-Kiwanan": { distance: 6.46, baseRegular: 18.00, baseStudent: 14.76 },
    "Town Proper-Aleosan": { distance: 9.03, baseRegular: 23.00, baseStudent: 18.86 },
    "Town Proper-Baliki": { distance: 7.24, baseRegular: 27.00, baseStudent: 21.60 },
    "Town Proper-Salunayan": { distance: 5.76, baseRegular: 25.00, baseStudent: 20.00 },
};

// Default gas price (₱70–₱79 range)
let currentGasPrice = 70;

// Updated Gas Price tiers — Ordinance-based logic
function getFareByGasPrice(gasPrice, baseRegular, baseStudent, passengerType) {
    let multiplier = 1.0;

    if (gasPrice >= 110) multiplier = 2.1;
    else if (gasPrice >= 100) multiplier = 1.9;
    else if (gasPrice >= 90) multiplier = 1.7;
    else if (gasPrice >= 80) multiplier = 1.5;
    else if (gasPrice >= 70) multiplier = 1.3; // ₱13/₱10.40 baseline
    else if (gasPrice >= 60) multiplier = 1.2;
    else if (gasPrice >= 50) multiplier = 1.1;
    else multiplier = 1.0;

    return passengerType === "student" ? baseStudent : baseRegular;
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

    if (!origin || !destination) return showError("Please select both origin and destination.");
    if (origin === destination) return showError("Origin and destination cannot be the same.");
    if (!gasPrice || gasPrice < 30 || gasPrice > 110) return showError("Invalid gas price range.");

    // Poblacion to Poblacion special fare
    if (origin.startsWith('Pob') && destination.startsWith('Pob')) {
        let fare = passengerType === 'student' ? 12.00 : 15.00;
        if (hasBaggage) fare += 10.00;
        return showFareResult(fare, origin, destination, "N/A", passengerType, gasPrice, hasBaggage);
    }

    const routeKey = `${origin}-${destination}`;
    const reverseRouteKey = `${destination}-${origin}`;

    let route = townRoutes[routeKey] || townRoutes[reverseRouteKey] ||
                outsideRoutes[routeKey] || outsideRoutes[reverseRouteKey];

    if (!route) {
        const townLocations = ["NDMC", "Town Hall", "Public Market", "Crossing", "Bus Terminal", 
                              "Pob 1", "Pob 2", "Pob 3", "Pob 4", "Pob 5", "Pob 6", "Pob 7", "Pob 8"];
        if (townLocations.includes(origin)) route = outsideRoutes[`Town Proper-${destination}`];
        else if (townLocations.includes(destination)) route = outsideRoutes[`Town Proper-${origin}`];
    }

    if (!route) return showError("Route not found. Please select a valid route.");

    let fare = getFareByGasPrice(gasPrice, route.baseRegular, route.baseStudent, passengerType);
    if (hasBaggage) fare += 10.00;

    showFareResult(fare, origin, destination, route.distance, passengerType, gasPrice, hasBaggage);
}

function showFareResult(fare, origin, destination, distance, passengerType, gasPrice, hasBaggage) {
    document.getElementById("fareAmount").textContent = fare.toFixed(2);
    document.getElementById("routeInfo").textContent = `${origin} → ${destination}`;
    document.getElementById("distanceInfo").textContent = distance !== "N/A" ? distance.toFixed(2) : "N/A";
    document.getElementById("passengerInfo").textContent = passengerType === "student" ? "Student/PWD/Senior" : "Regular";
    document.getElementById("gasPriceInfo").textContent = gasPrice.toFixed(2);

    const baggageInfo = document.getElementById("baggageInfo");
    baggageInfo.style.display = hasBaggage ? "block" : "none";

    document.getElementById("result").classList.add("show");
}

function showError(msg) {
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = msg;
    errorDiv.classList.add("show");
}
