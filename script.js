// Sikad Fare Calculator - Updated for Ordinance No. 536 (Midsayap)
// Gas Price Tiers: ₱30–40, ₱41–50, ₱51–60, ₱61–70, ₱71–80, ₱81–90, ₱91–100, ₱101–110

let currentGasPrice = 60; // Default 51–60 range

// 🗺️ Route Matrix (Base Fares at ₱51–60/L)
const baseRoutes = {
    "Town Proper-Villarica": { distance: 4.3, baseRegular: 21.00, baseStudent: 16.80 },
    "Town Proper-Sadaan": { distance: 3.56, baseRegular: 18.00, baseStudent: 14.76 },
    "Town Proper-Arizona": { distance: 7.63, baseRegular: 27.00, baseStudent: 21.60 },
    "Town Proper-Kimagango": { distance: 5.21, baseRegular: 21.00, baseStudent: 16.80 },
    "Town Proper-Rangaban": { distance: 7.50, baseRegular: 27.00, baseStudent: 21.60 },
    "Town Proper-Kiwanan": { distance: 6.46, baseRegular: 18.00, baseStudent: 14.76 },
    "Town Proper-Aleosan": { distance: 9.03, baseRegular: 23.00, baseStudent: 18.86 },
    "Town Proper-Agriculture": { distance: 5.01, baseRegular: 21.00, baseStudent: 16.80 },
    "Town Proper-Salunayan": { distance: 5.76, baseRegular: 25.00, baseStudent: 20.00 },
    "Town Proper-San Isidro": { distance: 3.63, baseRegular: 21.00, baseStudent: 16.80 },
    "Town Proper-Damatug": { distance: 5.72, baseRegular: 23.00, baseStudent: 18.43 },
    "Town Proper-Anonang": { distance: 8.50, baseRegular: 30.00, baseStudent: 24.00 },
    "Town Proper-Barongis": { distance: 9.57, baseRegular: 32.00, baseStudent: 25.60 },
    "Town Proper-Libungan Proper": { distance: 7.23, baseRegular: 25.00, baseStudent: 21.60 },
    "Town Proper-Palongoguen": { distance: 26.55, baseRegular: 25.00, baseStudent: 20.00 },
    "Town Proper-Bagumba": { distance: 4.48, baseRegular: 20.00, baseStudent: 16.80 },
    "Town Proper-Baliki": { distance: 7.24, baseRegular: 25.00, baseStudent: 20.00 }
};

// 🏙️ Short routes within Midsayap Town Proper
const townRoutes = {
    "Public Market-Town Hall": { distance: 0.8, baseRegular: 10.00, baseStudent: 8.00 },
    "Public Market-Bus Terminal": { distance: 2.5, baseRegular: 10.00, baseStudent: 8.00 },
    "Town Hall-Bus Terminal": { distance: 1.8, baseRegular: 10.00, baseStudent: 8.00 }
};

// 🧭 Normalize route names for flexible matching
function normalizeName(name) {
    if (!name) return "";
    name = name.trim();

    const townProperAliases = ["Town Proper", "Midsayap Proper", "Proper", "Poblacion", "Pob", "Centro"];
    if (townProperAliases.some(alias => name.toLowerCase().includes(alias.toLowerCase()))) {
        return "Town Proper";
    }

    if (name.toLowerCase().includes("agriculture")) return "Salunayan";
    if (name.toLowerCase().includes("salunayan")) return "Salunayan";

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// 🔁 Generate bidirectional route entries
const outsideRoutes = {};
Object.entries(baseRoutes).forEach(([key, value]) => {
    outsideRoutes[key] = value;
    const [a, b] = key.split("-");
    outsideRoutes[`${b}-${a}`] = value;
});
Object.entries(townRoutes).forEach(([key, value]) => {
    townRoutes[key] = value;
    const [a, b] = key.split("-");
    townRoutes[`${b}-${a}`] = value;
});

// 🔍 Route finder
function findRoute(origin, destination) {
    origin = normalizeName(origin);
    destination = normalizeName(destination);

    const routeKey = `${origin}-${destination}`;
    const reverseKey = `${destination}-${origin}`;

    return (
        townRoutes[routeKey] ||
        townRoutes[reverseKey] ||
        outsideRoutes[routeKey] ||
        outsideRoutes[reverseKey] ||
        null
    );
}

// 🔢 Fare multiplier logic
function getFareByGasPrice(gasPrice, baseRegular, baseStudent, passengerType) {
    let multiplier = 1.0;

    if (gasPrice >= 101) multiplier = 1.6;
    else if (gasPrice >= 91) multiplier = 1.5;
    else if (gasPrice >= 81) multiplier = 1.4;
    else if (gasPrice >= 71) multiplier = 1.3;
    else if (gasPrice >= 61) multiplier = 1.2;
    else if (gasPrice >= 51) multiplier = 1.0;
    else if (gasPrice >= 41) multiplier = 0.9;
    else multiplier = 0.8;

    return passengerType === "student" ? baseStudent * multiplier : baseRegular * multiplier;
}

// 🚲 Fare calculation
function calculateFare() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const passengerType = document.querySelector('input[name="passengerType"]:checked').value;
    const hasBaggage = document.getElementById("hasBaggage").checked;

    const gasPriceInput = document.getElementById("gasPrice");
    const gasPrice = gasPriceInput.style.display === "none" ? currentGasPrice : parseFloat(gasPriceInput.value);

    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");

    if (!origin || !destination) return showError("Please select both origin and destination.");
    if (origin === destination) return showError("Origin and destination cannot be the same.");
    if (gasPrice < 30 || gasPrice > 110) return showError("Please select a valid gas price range.");

    // Flat rate for Poblacion to Poblacion
    if (origin.startsWith("Pob") && destination.startsWith("Pob")) {
        let fare = passengerType === "student" ? 12.00 : 15.00;
        if (hasBaggage) fare += 10.00;
        displayResult(fare, `${origin} → ${destination}`, "N/A", passengerType, gasPrice, hasBaggage);
        return;
    }

    const route = findRoute(origin, destination);
    if (!route) return showError("Route not found. Please check your selection.");

    let fare = getFareByGasPrice(gasPrice, route.baseRegular, route.baseStudent, passengerType);

    if (hasBaggage) fare += 10;

    displayResult(fare, `${origin} → ${destination}`, route.distance, passengerType, gasPrice, hasBaggage);
}

// 🧾 Display fare result
function displayResult(fare, routeName, distance, passengerType, gasPrice, hasBaggage) {
    document.getElementById("fareAmount").textContent = fare.toFixed(2);
    document.getElementById("routeInfo").textContent = routeName;
    document.getElementById("distanceInfo").textContent = distance !== "N/A" ? parseFloat(distance).toFixed(2) : "N/A";
    document.getElementById("passengerInfo").textContent =
        passengerType === "student" ? "Student/PWD/Senior" : "Regular";
    document.getElementById("gasPriceInfo").textContent = gasPrice.toFixed(2);
    document.getElementById("baggageInfo").style.display = hasBaggage ? "block" : "none";
    document.getElementById("result").classList.add("show");
}

// ⚠️ Error
function showError(msg) {
    const err = document.getElementById("error");
    err.textContent = msg;
    err.classList.add("show");
}

// 🔄 Reset form
function resetForm() {
    document.getElementById("origin").value = "";
    document.getElementById("destination").innerHTML = '<option value="">-- Select Destination --</option>';
    document.getElementById("gasPrice").value = "55";
    document.getElementById("currentGasPrice").textContent = "51–60";
    currentGasPrice = 55;
    document.querySelector('input[name="passengerType"][value="student"]').checked = true;
    document.getElementById("hasBaggage").checked = false;
    document.getElementById("result").classList.remove("show");
    document.getElementById("error").classList.remove("show");
}

// ⛽ Toggle gas price input
function toggleGasPriceInput() {
    const gasPriceInput = document.getElementById("gasPrice");
    const btn = document.getElementById("changePriceBtn");

    if (gasPriceInput.style.display === "none") {
        gasPriceInput.style.display = "block";
        btn.textContent = "Done";
    } else {
        const newPrice = parseFloat(gasPriceInput.value);
        currentGasPrice = newPrice;
        const selectedOption = gasPriceInput.options[gasPriceInput.selectedIndex];
        document.getElementById("currentGasPrice").textContent = selectedOption.text;
        gasPriceInput.style.display = "none";
        btn.textContent = "Change";
    }
}

// 🧭 Update destination options dynamically
function updateDestinations() {
    const originSelect = document.getElementById("origin");
    const destinationSelect = document.getElementById("destination");
    const origin = originSelect.value;

    destinationSelect.innerHTML = '<option value="">-- Select Destination --</option>';

    const midsayapProper = [
        "Town Hall", "Public Market",
        "Pob 1", "Pob 2", "Pob 3", "Pob 4", "Pob 5", "Pob 6", "Pob 7", "Pob 8"
    ];

    const outsideMidsayap = [
        "Villarica", "Sadaan", "Arizona", "Kimagango", "Rangaban",
        "Kiwanan", "Aleosan", "Agriculture", "San Isidro", "Damatug",
        "Anonang", "Barongis", "Libungan Proper", "Palongoguen", "Salunayan",
        "Bagumba", "Baliki"
    ];

    const isOriginProper = midsayapProper.includes(origin);
    const isOriginOutside = outsideMidsayap.includes(origin);

    if (isOriginOutside) {
        const optGroup = document.createElement("optgroup");
        optGroup.label = "Within Midsayap Proper";
        midsayapProper.forEach(place => {
            const option = document.createElement("option");
            option.value = place;
            option.textContent = place;
            optGroup.appendChild(option);
        });
        destinationSelect.appendChild(optGroup);
    } else if (isOriginProper) {
        const optGroup1 = document.createElement("optgroup");
        optGroup1.label = "Within Midsayap Proper";
        midsayapProper.forEach(place => {
            if (place !== origin) {
                const option = document.createElement("option");
                option.value = place;
                option.textContent = place;
                optGroup1.appendChild(option);
            }
        });

        const optGroup2 = document.createElement("optgroup");
        optGroup2.label = "Outside Midsayap Proper";
        outsideMidsayap.forEach(place => {
            const option = document.createElement("option");
            option.value = place;
            option.textContent = place;
            optGroup2.appendChild(option);
        });

        destinationSelect.appendChild(optGroup1);
        destinationSelect.appendChild(optGroup2);
    }
}

// 🌐 Online/offline
function updateOnlineStatus() {
    const offlineIndicator = document.getElementById("offlineIndicator");
    offlineIndicator.style.display = navigator.onLine ? "none" : "block";
}

// 📦 PWA install & service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(reg => console.log("Service Worker registered:", reg.scope))
            .catch(err => console.log("Service Worker registration failed:", err));
    });
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("installPrompt").style.display = "block";
});

document.getElementById("installButton").addEventListener("click", async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.getElementById("installPrompt").style.display = "none";
    }
});

document.getElementById("dismissButton").addEventListener("click", () => {
    document.getElementById("installPrompt").style.display = "none";
});

window.addEventListener("appinstalled", () => {
    document.getElementById("installPrompt").style.display = "none";
});

window.addEventListener("load", () => {
    updateOnlineStatus();
    document.getElementById("changePriceBtn").addEventListener("click", toggleGasPriceInput);
    document.getElementById("gasPrice").value = currentGasPrice;
    const selectedOption = document.getElementById("gasPrice").options[document.getElementById("gasPrice").selectedIndex];
    document.getElementById("currentGasPrice").textContent = selectedOption.text;
});

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
