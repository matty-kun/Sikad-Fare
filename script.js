// Sikad Fare Calculator - Updated for Ordinance No. 536 (Midsayap)
// Gas Price Tiers: ₱30–40, ₱41–50, ₱51–60, ₱61–70, ₱71–80, ₱81–90, ₱91–100, ₱101–110

let currentGasPrice = 60; // Default 51–60 range
let currentMode = 'route'; // 'route', 'distance', or 'map'
let mapInstance = null;
let userMarker = null;
let destMarker = null;
let routeLine = null; // To hold the line on the map
let mapCenter = [7.2320, 124.3650]; // approximate Midsayap, Cotabato
let setOriginMode = false;

// localStorage keys
const LS_ORIGIN = 'sikad_map_origin';
const LS_DEST = 'sikad_map_dest';

// 📍 Custom Map Icons
const originIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const destIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const originMarkerOptions = { icon: originIcon, draggable: true };
const destMarkerOptions = { icon: destIcon };


// ️ Route Matrix (Base Fares at ₱51–60/L)
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

// 🏙️ Short routes within Midsayap Proper
const townRoutes = {
    "Public Market-Town Hall": { distance: 0.8, baseRegular: 15.00, baseStudent: 12.00 }
};

// 🧭 Normalize names for consistent matching
function normalizeName(name) {
    if (!name) return "";
    name = name.trim();
    const properAliases = ["Town Proper", "Midsayap Proper", "Town Hall", "Public Market", "Poblacion", "Pob", "Centro", "Proper"];
    if (properAliases.some(alias => name.toLowerCase().includes(alias.toLowerCase()))) {
        return "Town Proper";
    }
    if (name.toLowerCase().includes("agriculture")) return "Salunayan";
    if (name.toLowerCase().includes("salunayan")) return "Salunayan";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// 🔁 Generate bidirectional routes
const allRoutes = {};
Object.entries(baseRoutes).forEach(([key, value]) => {
    allRoutes[key] = value;
    const [a, b] = key.split("-");
    allRoutes[`${b}-${a}`] = value;
});
Object.entries(townRoutes).forEach(([key, value]) => {
    allRoutes[key] = value;
    const [a, b] = key.split("-");
    allRoutes[`${b}-${a}`] = value;
});

// 🔍 Route finder
function findRoute(origin, destination) {
    origin = normalizeName(origin);
    destination = normalizeName(destination);
    const routeKey = `${origin}-${destination}`;
    const reverseKey = `${destination}-${origin}`;
    return allRoutes[routeKey] || allRoutes[reverseKey] || null;
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
    // Clear previous errors and results
    document.getElementById("error").classList.remove("show");
    document.getElementById("result").classList.remove("show");

    const passengerType = document.querySelector('input[name="passengerType"]:checked').value;
    const hasBaggage = document.getElementById('hasBaggage').checked;
    const gasPrice = parseFloat(document.getElementById('gasPrice').value);

    let fare = 0;
    let routeName = "N/A";
    let distance = "N/A";

    if (currentMode === 'route') {
        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value;

        if (!origin || !destination) {
            return showError("Please select both an origin and a destination.");
        }

        const route = findRoute(origin, destination);
        if (!route) {
            // Special case for within town proper
            const properAliases = ["Town Proper", "Midsayap Proper", "Town Hall", "Public Market", "Poblacion", "Pob", "Centro", "Proper"];
            const isOriginProper = properAliases.some(alias => normalizeName(origin).toLowerCase().includes(alias.toLowerCase()));
            const isDestProper = properAliases.some(alias => normalizeName(destination).toLowerCase().includes(alias.toLowerCase()));

            if (isOriginProper && isDestProper) {
                const withinTownFare = getFareByGasPrice(gasPrice, 15.00, 12.00, passengerType);
                fare = hasBaggage ? withinTownFare + 10 : withinTownFare;
                routeName = `${origin} to ${destination}`;
                distance = "Within Town Proper";
                displayResult(fare, routeName, distance, passengerType, gasPrice, hasBaggage);
                return;
            }
            return showError("Fare for this route is not defined in the ordinance. Please use Distance or Map mode.");
        }

        fare = getFareByGasPrice(gasPrice, route.baseRegular, route.baseStudent, passengerType);
        routeName = `${normalizeName(origin)} to ${normalizeName(destination)}`;
        distance = route.distance;

    }

    if (hasBaggage) fare += 10;
    displayResult(fare, routeName, distance, passengerType, gasPrice, hasBaggage);
}


// 🧾 Show fare
function displayResult(fare, routeName, distance, passengerType, gasPrice, hasBaggage) {
    document.getElementById("fareAmount").textContent = fare.toFixed(2);
    document.getElementById("routeInfo").textContent = routeName;
    document.getElementById("distanceInfo").textContent = distance === "Within Town Proper" ? distance : distance ? distance.toFixed(2) : "N/A";
    document.getElementById("passengerInfo").textContent = passengerType === "student" ? "Student/PWD/Senior" : "Regular";
    document.getElementById("gasPriceInfo").textContent = gasPrice.toFixed(2);
    document.getElementById("baggageInfo").style.display = hasBaggage ? "block" : "none";
    document.getElementById("result").classList.add("show");
}

// ⚠️ Error message
function showError(msg) {
    const err = document.getElementById("error");
    err.textContent = msg;
    err.classList.add("show");
}



// Central function to control UI mode
function setMode(newMode) {
    currentMode = newMode;

    const originContainer = document.getElementById('originContainer');
    const destinationContainer = document.getElementById('destinationContainer');
    const mapCard = document.getElementById('mapCard');

    // Reset all mode buttons and containers
    ['routeModeBtn', 'mapModeBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active');
    });
    originContainer.style.display = 'none';
    destinationContainer.style.display = 'none';
    mapCard.style.display = 'none';

    // Activate the correct mode
    switch (currentMode) {
        case 'route':
            originContainer.style.display = 'block';
            destinationContainer.style.display = 'block';
            document.getElementById('calculateFareBtn').style.display = 'inline-block';
            document.getElementById('resetFormBtn').style.display = 'inline-block';
            document.getElementById('routeModeBtn').classList.add('active');
            break;
        case 'map':
            mapCard.style.display = 'block';
            if (!mapInstance) initMap();
            setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 10);
            document.getElementById('calculateFareBtn').style.display = 'none';
            document.getElementById('resetFormBtn').style.display = 'none';
            // Ensure map-specific buttons are managed
            document.getElementById('resetMapBtn').style.display = 'block';
            document.getElementById('mapModeBtn').classList.add('active');
            break;
    }
    document.getElementById("result").classList.remove("show");
}

// Initialize Leaflet map
function initMap() {
    mapInstance = L.map('map').setView(mapCenter, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 200);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            mapInstance.setView([lat, lng], 13);
            if (userMarker) { userMarker.setLatLng([lat, lng]); }
            else { userMarker = L.marker([lat, lng], originMarkerOptions).addTo(mapInstance).bindPopup('You are here').openPopup(); }
        }, () => {
            if (!userMarker) userMarker = L.marker(mapCenter, originMarkerOptions).addTo(mapInstance).bindPopup('Default location');
        });
    } else {
        userMarker = L.marker(mapCenter, originMarkerOptions).addTo(mapInstance).bindPopup('Location unavailable');
    }


    document.getElementById('setOriginBtn').addEventListener('click', () => {
        setOriginMode = !setOriginMode; // Toggle the mode
        const btn = document.getElementById('setOriginBtn');
        if (setOriginMode) {
            btn.textContent = 'Click map to set Origin (tap again to cancel)';
            btn.style.background = '#ffc107'; // Highlight color
            btn.style.borderColor = '#ffc107';
        } else {
            btn.textContent = 'Set Origin by Click';
            btn.style.background = ''; // Revert to default style
            btn.style.borderColor = '';
        }
    });



    mapInstance.on('click', function(e) {
        const { lat, lng } = e.latlng;
        if (setOriginMode) {
            if (userMarker) { userMarker.setLatLng([lat, lng]); }
            else { userMarker = L.marker([lat, lng], originMarkerOptions).addTo(mapInstance).bindPopup('Origin (you)').openPopup(); }
            localStorage.setItem(LS_ORIGIN, JSON.stringify({ lat, lng }));
            userMarker.on('dragend', () => {
                if (destMarker) {
                    const a = userMarker.getLatLng();
                    const b = destMarker.getLatLng();
                    const d = haversineDistance(a.lat, a.lng, b.lat, b.lng);
                    localStorage.setItem(LS_ORIGIN, JSON.stringify({ lat: a.lat, lng: a.lng }));
                    computeMapFareAndShow(d);
                    drawRouteLine();
                }
            });
            setOriginMode = false;
            document.getElementById('setOriginBtn').textContent = 'Set Origin by Click';
            document.getElementById('setOriginBtn').style.background = '';
            document.getElementById('setOriginBtn').style.borderColor = '';
            return;
        }
        if (destMarker) { destMarker.setLatLng([lat, lng]); }
        else { destMarker = L.marker([lat, lng], destMarkerOptions).addTo(mapInstance).bindPopup('Destination').openPopup(); }
        drawRouteLine();
        localStorage.setItem(LS_DEST, JSON.stringify({ lat, lng }));
    });



    document.getElementById('mapCalculateBtn').addEventListener('click', () => {
        if (!destMarker) {
            return showError('Please set a destination on the map first.');
        }
        const destLatLng = destMarker.getLatLng();
        const originLatLng = userMarker ? userMarker.getLatLng() : L.latLng(mapCenter[0], mapCenter[1]);
        const distKm = haversineDistance(originLatLng.lat, originLatLng.lng, destLatLng.lat, destLatLng.lng);
        computeMapFareAndShow(distKm);
    });


    document.getElementById('resetMapBtn').addEventListener('click', () => {
        document.getElementById("error").classList.remove("show");
        resetForm(); // The main reset function already handles map state
        showError('Map has been reset.'); // Provide user feedback
    });

    document.getElementById('resetOriginBtn').addEventListener('click', () => {
        if (!mapInstance) return;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const { latitude, longitude } = pos.coords;
                if (userMarker) {
                    userMarker.setLatLng([latitude, longitude]);
                    mapInstance.setView([latitude, longitude], 14); // Center view on user
                    localStorage.removeItem(LS_ORIGIN); // Remove manual origin override
                    showError("Origin reset to your current location.");
                }
            }, () => {
                showError("Could not get your location. Please enable location services.");
            });
        } else {
            showError("Geolocation is not supported by your browser.");
        }
    });

    try {
        const savedOrigin = JSON.parse(localStorage.getItem(LS_ORIGIN));
        if (savedOrigin && savedOrigin.lat && savedOrigin.lng) {
            if (userMarker) { userMarker.setLatLng([savedOrigin.lat, savedOrigin.lng]); }
            else { userMarker = L.marker([savedOrigin.lat, savedOrigin.lng], originMarkerOptions).addTo(mapInstance).bindPopup('Origin (saved)'); }
            userMarker.on('dragend', () => {
                if (destMarker) {
                    const a = userMarker.getLatLng();
                    const b = destMarker.getLatLng();
                    const d = haversineDistance(a.lat, a.lng, b.lat, b.lng);
                    localStorage.setItem(LS_ORIGIN, JSON.stringify({ lat: a.lat, lng: a.lng }));
                    computeMapFareAndShow(d);
                    drawRouteLine();
                }
            });
        }
        const savedDest = JSON.parse(localStorage.getItem(LS_DEST));
        if (savedDest && savedDest.lat && savedDest.lng) {
            if (destMarker) { destMarker.setLatLng([savedDest.lat, savedDest.lng]); }
            else { destMarker = L.marker([savedDest.lat, savedDest.lng], destMarkerOptions).addTo(mapInstance).bindPopup('Destination (saved)'); }
            if (userMarker) {
                const d = haversineDistance(userMarker.getLatLng().lat, userMarker.getLatLng().lng, savedDest.lat, savedDest.lng);
                computeMapFareAndShow(d);
                drawRouteLine();
            }
        }
    } catch (e) { /* ignore */ }
}

// 🗺️ Draw a line between origin and destination markers
function drawRouteLine() {
    // If either marker is missing, remove the line if it exists
    if (!userMarker || !destMarker) {
        if (routeLine) {
            routeLine.remove();
            routeLine = null;
        }
        return;
    }
    const latlngs = [userMarker.getLatLng(), destMarker.getLatLng()];
    if (routeLine) {
        routeLine.setLatLngs(latlngs); // Update existing line
    } else {
        routeLine = L.polyline(latlngs, { color: '#004ea8', weight: 5, opacity: 0.8 }).addTo(mapInstance); // Create new line
    }
}

// Haversine formula (returns distance in km)
function haversineDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function computeMapFareAndShow(distKm) {
    const passengerType = document.querySelector('input[name="passengerType"]:checked').value;
    const hasBaggage = document.getElementById('hasBaggage').checked;
    const gasPriceElem = document.getElementById('gasPrice');
    const gasPrice = gasPriceElem.style.display === 'none' ? currentGasPrice : parseFloat(gasPriceElem.value);

    // Automatically apply an 8% multiplier to estimate road distance from straight-line distance
    const estimatedRoadDistKm = distKm * 1.08;

    let ratePerKm = 4.34;
    if (gasPrice >= 80) ratePerKm *= 1.1;
    if (gasPrice >= 90) ratePerKm *= 1.2;

    let regularFare, studentFare;

    // Apply minimum fare for distances under 1 km, similar to "within town proper"
    if (estimatedRoadDistKm < 1) {
        const baseMinRegular = 15.00;
        const baseMinStudent = 12.00;
        regularFare = getFareByGasPrice(gasPrice, baseMinRegular, baseMinStudent, 'regular');
        studentFare = getFareByGasPrice(gasPrice, baseMinRegular, baseMinStudent, 'student');
    } else {
        regularFare = estimatedRoadDistKm * ratePerKm;
        studentFare = regularFare * 0.8;
    }

    // Add baggage fee after all other calculations
    if (hasBaggage) { regularFare += 10; studentFare += 10; }

    const primaryFare = passengerType === 'student' ? studentFare : regularFare;

    document.getElementById('mapRateUsed').textContent = `Rate Used: ₱${ratePerKm.toFixed(2)} /km`;    
    const mapRoadEstimateEl = document.getElementById('mapRoadEstimate');
    if (mapRoadEstimateEl) {
        mapRoadEstimateEl.textContent = `Estimated road distance: ${estimatedRoadDistKm.toFixed(2)} km`;
    }

    displayResult(primaryFare, 'Map Route', estimatedRoadDistKm, passengerType, gasPrice, hasBaggage);
}

// 🔄 Reset
function resetForm() {
    document.getElementById("origin").value = "";
    updateDestinations(); // This will reset the destination dropdown correctly
    document.getElementById("gasPrice").value = "60";
    document.getElementById("currentGasPrice").textContent = "51–60";
    currentGasPrice = 60;
    document.querySelector('input[name="passengerType"][value="student"]').checked = true;
    document.getElementById("hasBaggage").checked = false;

    // Reset map-specific text
    document.getElementById('mapRateUsed').textContent = 'Rate Used: ₱- /km';
    document.getElementById('mapRoadEstimate').textContent = 'Estimated road distance: - km';

    // Reset map markers and related UI
    if (destMarker) {
        destMarker.remove();
        destMarker = null;
    }
    // Also remove the route line from the map
    if (routeLine) {
        routeLine.remove();
        routeLine = null;
    }
    localStorage.removeItem(LS_DEST); // Clear saved destination

    // Do not reset the mode, just clear inputs and results
    document.getElementById("result").classList.remove("show");
}

// ⛽ Gas price toggle
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

// 🧭 Update destination dropdown dynamically
function updateDestinations() {
    const origin = document.getElementById("origin").value;
    const destinationSelect = document.getElementById("destination");
    destinationSelect.innerHTML = '<option value="">-- Select Destination --</option>';
    const midsayapProper = ["Town Hall", "Public Market", "Pob 1", "Pob 2", "Pob 3", "Pob 4", "Pob 5", "Pob 6", "Pob 7", "Pob 8"];
    const outsideMidsayap = ["Villarica", "Sadaan", "Arizona", "Kimagango", "Rangaban", "Kiwanan", "Aleosan", "Agriculture", "San Isidro", "Damatug", "Anonang", "Barongis", "Libungan Proper", "Palongoguen", "Salunayan", "Bagumba", "Baliki"];
    const isOriginProper = midsayapProper.includes(origin);
    const isOriginOutside = outsideMidsayap.includes(origin);

    if (isOriginOutside) {
        const optGroup = document.createElement("optgroup");
        optGroup.label = "Midsayap Proper";
        midsayapProper.forEach(place => {
            const opt = document.createElement("option");
            opt.value = place;
            opt.textContent = place;
            optGroup.appendChild(opt);
        });
        destinationSelect.appendChild(optGroup);
    } else if (isOriginProper) {
        const opt1 = document.createElement("optgroup");
        opt1.label = "Within Midsayap Proper";
        midsayapProper.forEach(place => {
            if (place !== origin) {
                const opt = document.createElement("option");
                opt.value = place;
                opt.textContent = place;
                opt1.appendChild(opt);
            }
        });
        const opt2 = document.createElement("optgroup");
        opt2.label = "Outside Midsayap Proper";
        outsideMidsayap.forEach(place => {
            const opt = document.createElement("option");
            opt.value = place;
            opt.textContent = place;
            opt2.appendChild(opt);
        });
        destinationSelect.appendChild(opt1);
        destinationSelect.appendChild(opt2);
    }
}

// 🌐 Online/offline indicator
function updateOnlineStatus() {
    document.getElementById("offlineIndicator").style.display = navigator.onLine ? "none" : "block";
}

// 📦 PWA setup
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("Service Worker registered:", reg.scope))
            .catch(err => console.log("SW registration failed:", err));
    });
}
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
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

// Initial setup on window load
window.addEventListener("load", () => {
    updateOnlineStatus();
    document.getElementById("origin").addEventListener("change", updateDestinations);
    document.getElementById("changePriceBtn").addEventListener("click", toggleGasPriceInput);
    const selectedOption = document.getElementById("gasPrice").options[document.getElementById("gasPrice").selectedIndex];
    document.getElementById("currentGasPrice").textContent = selectedOption.text;
    setMode('route'); // Initialize the UI to the default route mode

    // Hide error on interaction
    const errorHidingElements = [
        'origin', 'destination', 'gasPrice', 'student', 'regular', 'hasBaggage',
        'changePriceBtn'
    ];
    const elements = ['routeModeBtn', 'mapModeBtn', 'changePriceBtn', 'origin', 'destination', 'gasPrice', 'student', 'regular', 'hasBaggage', 'mapCalculateBtn', 'resetMapBtn', 'calculateFareBtn'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const event = (el.tagName === 'SELECT' || el.type === 'text' || el.type === 'number') ? 'input' : 'click';
            el.addEventListener(event, () => {
                document.getElementById("error").classList.remove("show");
            });
        }
    });
});

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);