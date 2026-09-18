// ======================================================
// PULSECARE ECG WEBSITE
// ======================================================


// ================= PAGE NAVIGATION =================

function showPage(pageId) {

    // Hide all pages
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    // Show selected page
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }


    // Refresh history when opening history page
    if (pageId === "history") {
        displayHistory();
    }


    // Refresh comparison when opening comparison page
    if (pageId === "compare") {
        updateComparison();
    }

}



// ================= ECG WAVEFORM =================

// Create ECG-like demonstration data

function createECGData(length = 100) {

    let data = [];

    for (let i = 0; i < length; i++) {

        let x = i / 10;

        let value =
            Math.sin(x * 2.5) * 0.15 +
            Math.sin(x * 5) * 0.05;

        // Add ECG-like peak
        if (i % 25 === 10) {
            value = 1.2;
        }

        if (i % 25 === 11) {
            value = -0.4;
        }

        if (i % 25 === 12) {
            value = 0.7;
        }

        data.push(value);
    }

    return data;
}



// ================= CHART SETTINGS =================

let dashboardChart;
let liveChart;
let comparisonChart;



function createChart(canvasId, datasets) {

    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        return null;
    }

    const labels = [];

    for (let i = 0; i < 100; i++) {
        labels.push("");
    }


    return new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: datasets

        },

        options: {

            responsive: true,

            animation: false,

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                x: {
                    display: false
                },

                y: {
                    beginAtZero: false
                }

            },

            elements: {

                point: {
                    radius: 0
                },

                line: {
                    tension: 0.25
                }

            }

        }

    });

}



// ================= INITIALIZE DASHBOARD =================

function initializeCharts() {

    const ecgData = createECGData();


    dashboardChart = createChart(

        "dashboardChart",

        [
            {
                label: "ECG Waveform",
                data: ecgData,
                fill: false
            }
        ]

    );


    liveChart = createChart(

        "liveChart",

        [
            {
                label: "Live ECG",
                data: ecgData,
                fill: false
            }
        ]

    );

}



// ================= LIVE HEART RATE =================

let currentBPM = 72;


function updateHeartRate() {

    // Small demonstration variation

    currentBPM =
        70 +
        Math.floor(Math.random() * 7);


    const dashboardBPM =
        document.getElementById("dashboardBPM");

    const liveBPM =
        document.getElementById("liveBPM");


    if (dashboardBPM) {
        dashboardBPM.textContent = currentBPM;
    }


    if (liveBPM) {
        liveBPM.textContent = currentBPM;
    }

}



// Update demonstration value every few seconds

setInterval(updateHeartRate, 3000);



// ================= SAVE SESSION =================

function saveSession() {

    const sessions =
        JSON.parse(
            localStorage.getItem("ecgSessions")
        ) || [];


    const now = new Date();


    const session = {

        id: Date.now(),

        bpm: currentBPM,

        date: now.toLocaleDateString(),

        time: now.toLocaleTimeString(),

        waveform: createECGData()

    };


    sessions.push(session);


    localStorage.setItem(
        "ecgSessions",
        JSON.stringify(sessions)
    );


    updateSessionCount();


    alert(
        "ECG session saved successfully!"
    );

}



// ================= SESSION COUNT =================

function updateSessionCount() {

    const sessions =
        JSON.parse(
            localStorage.getItem("ecgSessions")
        ) || [];


    const count =
        document.getElementById("sessionCount");


    if (count) {
        count.textContent = sessions.length;
    }

}



// ================= HISTORY PAGE =================

function displayHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!container) {
        return;
    }


    const sessions =
        JSON.parse(
            localStorage.getItem("ecgSessions")
        ) || [];


    if (sessions.length === 0) {

        container.innerHTML = `

            <div class="empty-history">

                No sessions saved yet.

            </div>

        `;

        return;

    }


    // Display newest first

    const reversedSessions =
        [...sessions].reverse();


    container.innerHTML = "";


    reversedSessions.forEach(
        (session, index) => {

            const card =
                document.createElement("div");


            card.className =
                "history-card";


            card.innerHTML = `

                <div>

                    <h3>
                        Session ${sessions.length - index}
                    </h3>

                    <p>
                        ${session.date}
                        •
                        ${session.time}
                    </p>

                </div>


                <div class="history-bpm">

                    ${session.bpm} BPM

                </div>

            `;


            container.appendChild(card);

        }

    );

}



// ================= COMPARE WITH PREVIOUS =================

function comparePrevious() {

    const sessions =
        JSON.parse(
            localStorage.getItem("ecgSessions")
        ) || [];


    // Need at least one previous saved session

    if (sessions.length === 0) {

        alert(
            "Please save a session first. Then you can compare the current session with it."
        );

        return;

    }


    // Open comparison page

    showPage("compare");


    updateComparison();

}



// ================= UPDATE COMPARISON =================

function updateComparison() {

    const sessions =
        JSON.parse(
            localStorage.getItem("ecgSessions")
        ) || [];


    const current =
        currentBPM;


    const currentBPMElement =
        document.getElementById(
            "currentCompareBPM"
        );


    if (currentBPMElement) {
        currentBPMElement.textContent =
            current;
    }


    const currentDate =
        document.getElementById(
            "currentCompareDate"
        );


    if (currentDate) {

        const now = new Date();

        currentDate.textContent =
            now.toLocaleDateString()
            + " • "
            + now.toLocaleTimeString();

    }


    // No previous session

    if (sessions.length === 0) {

        document.getElementById(
            "previousCompareBPM"
        ).textContent = "--";


        document.getElementById(
            "previousCompareDate"
        ).textContent =
            "No previous session";


        document.getElementById(
            "differenceValue"
        ).textContent = "--";


        document.getElementById(
            "differenceText"
        ).textContent =
            "Save at least one previous session to compare.";


        return;

    }



    // Get latest saved session

    const previous =
        sessions[sessions.length - 1];


    const previousBPM =
        document.getElementById(
            "previousCompareBPM"
        );


    previousBPM.textContent =
        previous.bpm;


    const previousDate =
        document.getElementById(
            "previousCompareDate"
        );


    previousDate.textContent =
        previous.date
        + " • "
        + previous.time;



    // Calculate difference

    const difference =
        current - previous.bpm;


    const differenceValue =
        document.getElementById(
            "differenceValue"
        );


    differenceValue.textContent =
        difference > 0
            ? "+" + difference
            : difference;



    // Comparison text

    const differenceText =
        document.getElementById(
            "differenceText"
        );


    if (difference > 0) {

        differenceText.textContent =
            "Current session heart rate is higher than the previous saved session.";

    }

    else if (difference < 0) {

        differenceText.textContent =
            "Current session heart rate is lower than the previous saved session.";

    }

    else {

        differenceText.textContent =
            "Current and previous session heart rates are the same.";

    }



    // Update summary

    document.getElementById(
        "summaryCurrent"
    ).textContent =
        current + " BPM";


    document.getElementById(
        "summaryPrevious"
    ).textContent =
        previous.bpm + " BPM";


    document.getElementById(
        "summaryDifference"
    ).textContent =
        difference > 0
            ? "+" + difference + " BPM"
            : difference + " BPM";


    let result = "";


    if (difference > 0) {

        result = "Higher";

    }

    else if (difference < 0) {

        result = "Lower";

    }

    else {

        result = "Same";

    }


    document.getElementById(
        "comparisonResult"
    ).textContent =
        result;



    // Draw comparison chart

    drawComparisonChart(
        previous.waveform
    );

}



// ================= COMPARISON CHART =================

function drawComparisonChart(previousWaveform) {

    const canvas =
        document.getElementById(
            "comparisonChart"
        );


    if (!canvas) {
        return;
    }


    // Destroy old chart

    if (comparisonChart) {

        comparisonChart.destroy();

    }


    const currentWaveform =
        createECGData();


    const labels = [];


    for (let i = 0; i < 100; i++) {

        labels.push("");

    }


    comparisonChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label:
                            "Current Session",

                        data:
                            currentWaveform,

                        fill: false

                    },


                    {

                        label:
                            "Previous Session",

                        data:
                            previousWaveform,

                        fill: false

                    }

                ]

            },


            options: {

                responsive: true,

                animation: false,

                scales: {

                    x: {
                        display: false
                    },

                    y: {
                        beginAtZero: false
                    }

                },

                elements: {

                    point: {
                        radius: 0
                    },

                    line: {
                        tension: 0.25
                    }

                }

            }

        });

}



// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeCharts();

        updateSessionCount();

        updateHeartRate();

    }
);