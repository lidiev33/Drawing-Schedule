function filterTable() {
    const selectElement = document.getElementById("column-select");
    const selectedValue = selectElement.value;
    const table = document.getElementById("schedule-table");
    const headers = table.getElementsByTagName("th");
    const rows = table.getElementsByTagName("tr");

    // Always show the first column (Time)
    headers[0].style.display = ""; // Show Time header
    for (let j = 0; j < rows.length; j++) {
        rows[j].cells[0].style.display = ""; // Show Time cells
    }

    // Loop through all headers and hide/show other columns based on selection
    for (let i = 1; i < headers.length; i++) { // Start from 1 to skip the Time column
        if (selectedValue === "all") {
            headers[i].style.display = ""; // Show all headers except Time (already shown)
for (let j = 0; j < rows.length; j++) {
                rows[j].cells[i].style.display = ""; // Show all cells except Time (already shown)
            }
        } else {
            if (headers[i].innerText === selectedValue) {
                headers[i].style.display = ""; // Show selected header
                for (let j = 0; j < rows.length; j++) {
                    rows[j].cells[i].style.display = ""; // Show selected column cells
                }
            } else {
                headers[i].style.display = "none"; // Hide other headers
for (let j = 0; j < rows.length; j++) {
                    rows[j].cells[i].style.display = "none"; // Hide other column cells
                }
            }
        }
    }
}

function addCustomExercise() {
    const exerciseDescription = document.getElementById("exercise-description").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const timeFrame = document.getElementById("time-frame").value;
    const lessonLetter = document.getElementById("lesson-letter").value;

    // Find the right row for the time frame and update the appropriate cell
    const rows = document.querySelectorAll("#schedule-body tr");
    for (const row of rows) {
        if (row.dataset.time === timeFrame) {
            const lessonIndex = { A: 1, B: 2, C: 3, D: 4, E: 5 }[lessonLetter];
            const lessonCell = row.cells[lessonIndex];

            // Set the exercise description and quantity
            lessonCell.innerHTML = `${exerciseDescription}<br>Set: ${quantity}<br>`;
            lessonCell.onclick = function() { updateQuantity(lessonCell); }; // Re-assign click handler
            break;
        }
    }

 // Clear input fields after adding
    document.getElementById("exercise-description").value = "";
    document.getElementById("quantity").value = "";
}

function addNewRow() {
    const scheduleBody = document.getElementById("schedule-body");
    const newRow = document.createElement("tr");

    // Get the start and end time values
    const startTime = document.getElementById("new-start-time").value;
    const endTime = document.getElementById("new-end-time").value;

    // Create a new cell for the time
    const timeCell = document.createElement("td");
    timeCell.innerText = `${startTime} - ${endTime}`;
    newRow.appendChild(timeCell);
    newRow.dataset.time = `${startTime}`; // Set data attribute for filtering

    // Create empty cells for each lesson column (A to E)
    for (let i = 1; i <= 5; i++) { // 5 columns for A to E
        const lessonCell = document.createElement("td");
        lessonCell.onclick = function() { updateQuantity(lessonCell); }; // Set click event
        newRow.appendChild(lessonCell);
    }
    // Append the new row to the schedule body
    scheduleBody.appendChild(newRow);


    // Add the new time to the time frame dropdown
    const timeFrameSelect = document.getElementById("time-frame");
    const newOption = document.createElement("option");
    newOption.value = startTime; // Using start time as the value
    newOption.textContent = `${startTime} - ${endTime}`; // Using start-end time as the text
    timeFrameSelect.appendChild(newOption);

    // Clear the input fields after adding the row
    document.getElementById("new-start-time").value = "";
    document.getElementById("new-end-time").value = "";
}

function updateQuantity(cell) {
    // Prompt for the quantity
    const quantity = prompt("Enter the quantity you have completed:");

// If the user cancels or doesn't enter a value, do nothing
    if (quantity === null || quantity.trim() === "") {
        return;
    }

    const setQuantity = parseInt(cell.innerText.split("<br>")[0].split(": ")[1]) || 0; // Extract the set quantity
    const enteredQuantity = parseInt(quantity);

    // Check if there's already a quantity done and append new quantity
    const existingDoneText = cell.innerHTML.split("<br>")[2] || "";
    const existingDoneQuantity = existingDoneText.includes("Quantity Done: ") ? parseInt(existingDoneText.split(": ")[1]) : 0;

// Update the cell with the new quantity done
    const newQuantity = existingDoneQuantity + enteredQuantity;
    cell.innerHTML = `${cell.innerHTML.split("<br>").slice(0, 2).join("<br>")}<br>Quantity Done: ${newQuantity}`;

    // Change cell background color if completed
    if (newQuantity >= setQuantity) {
        cell.classList.add("completed");
    } else {
        cell.classList.remove("completed"); // Remove highlight if not completed
    }
}


let savedPrograms = {}; // Object to store saved programs

function saveProgram() {
    const programName = document.getElementById("program-name").value;
    if (!programName) {
        alert("Please enter a program name.");
        return;
    }

    const rows = document.querySelectorAll("#schedule-body tr");
    const programData = [];

    rows.forEach(row => {
        const rowData = {
            time: row.dataset.time,
            exercises: []
        };
for (let i = 1; i < row.cells.length; i++) { // Skip time column
            const cell = row.cells[i];
            const exercise = cell.innerHTML.split("<br>")[0] || ""; // Exercise description
            const quantitySet = parseInt(cell.innerHTML.split("<br>")[1]?.split(": ")[1]) || 0; // Quantity Set
            const quantityDone = parseInt(cell.innerHTML.split("<br>")[2]?.split(": ")[1]) || 0; // Quantity Done

            rowData.exercises.push({
                exercise,
                quantitySet,
                quantityDone
            });
        }

        programData.push(rowData);
    });

    // Save the program data
    savedPrograms[programName] = programData;
    updateProgramList();
    alert("Program saved successfully!");
}

function updateProgramList() {
    const loadProgramSelect = document.getElementById("load-program");
    loadProgramSelect.innerHTML = '<option value="">Select Program</option>'; // Clear existing options

    for (const programName in savedPrograms) {
        const option = document.createElement("option");
        option.value = programName;
        option.textContent = programName;
        loadProgramSelect.appendChild(option);
    }
}

function loadProgram() {
    const selectedProgram = document.getElementById("load-program").value;
    if (!selectedProgram) {
        alert("Please select a program to load.");
        return;
    }

    const programData = savedPrograms[selectedProgram];
    const rows = document.querySelectorAll("#schedule-body tr");

    if (confirm("Do you want to save the current program before loading a new one?")) {
        saveProgram();
    }


    // Clear existing table data
    rows.forEach(row => {
        for (let i = 1; i < row.cells.length; i++) {
            row.cells[i].innerHTML = "";
            row.cells[i].classList.remove("completed");
        }
    });

    // Load new program data
    programData.forEach((rowData, rowIndex) => {
        const row = rows[rowIndex];
        rowData.exercises.forEach((exerciseData, exerciseIndex) => {
            const cell = row.cells[exerciseIndex + 1]; // Offset by 1 for time column
            if (exerciseData.exercise) {
                cell.innerHTML = ` ${exerciseData.exercise}<br>Quantity Set: ${exerciseData.quantitySet}<br>Quantity Done: ${exerciseData.quantityDone}`;
                if (exerciseData.quantityDone >= exerciseData.quantitySet) {
                    cell.classList.add("completed");
                }
            }
        });
    });
}



