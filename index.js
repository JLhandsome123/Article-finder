// Get references to DOM elements
const articleInput = document.getElementById("article-input");
const lockerInput = document.getElementById("locker-input");
const addArticleButton = document.getElementById("add-article-button");
const articleTableBody = document.getElementById("article-table").getElementsByTagName("tbody")[0];
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Load existing data from localStorage or JSON file
window.addEventListener("load", () => {
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    if (savedArticles.length > 0) {
        savedArticles.forEach((article) => {
            addArticleToTable(article.articleNumber, article.lockerNumber, false);
        });
    } else {
        // Load JSON data if no localStorage data exists
        fetch("index.json")
            .then((response) => response.json())
            .then((jsonData) => {
                jsonData.forEach((article) => {
                    addArticleToTable(article.articleNumber, article.lockerNumber, false);
                });
                // Save loaded JSON data to localStorage for future use
                localStorage.setItem("articles", JSON.stringify(jsonData));
            })
            .catch((error) => console.error("Error loading JSON data:", error));
    }
});

// Add article and locker to the table
addArticleButton.addEventListener("click", () => {
    const articleNumber = articleInput.value.trim();
    const lockerNumber = lockerInput.value.trim();

    // Validate inputs
    if (articleNumber === "" || lockerNumber === "") {
        alert("Please enter both Article Number and Locker Number.");
        return;
    }

    addArticleToTable(articleNumber, lockerNumber, true);

    // Clear input fields
    articleInput.value = "";
    lockerInput.value = "";
});

// Add an article to the table and optionally save it
function addArticleToTable(articleNumber, lockerNumber, saveToStorage) {
    // Create a new row
    const newRow = articleTableBody.insertRow();

    // Add cells to the row
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    // Set cell content
    cell1.textContent = articleTableBody.rows.length; // Row number
    cell2.textContent = articleNumber;
    cell3.textContent = lockerNumber;

    // Add a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn-delete";
    deleteButton.addEventListener("click", () => {
        newRow.remove();
        updateRowNumbers(); // Update row numbers after deletion
        removeArticleFromStorage(articleNumber, lockerNumber); // Remove from localStorage
    });
    cell4.appendChild(deleteButton);

    // Save to localStorage if needed
    if (saveToStorage) {
        saveArticleToStorage(articleNumber, lockerNumber);
    }
}

// Save an article to localStorage
function saveArticleToStorage(articleNumber, lockerNumber) {
    const savedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    savedArticles.push({ articleNumber, lockerNumber });
    localStorage.setItem("articles", JSON.stringify(savedArticles));
}

// Remove an article from localStorage
function removeArticleFromStorage(articleNumber, lockerNumber) {
    let savedArticles = JSON.parse(localStorage.getItem("articles")) || [];
    savedArticles = savedArticles.filter(
        (article) => article.articleNumber !== articleNumber || article.lockerNumber !== lockerNumber
    );
    localStorage.setItem("articles", JSON.stringify(savedArticles));
}

// Search articles by article number
searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value.trim().toLowerCase();

    // Get all rows from the table body
    const rows = articleTableBody.getElementsByTagName("tr");

    for (const row of rows) {
        const articleCell = row.cells[1]; // Article Number cell

        // Check if the article number matches the search query
        if (articleCell && articleCell.textContent.toLowerCase().includes(searchQuery)) {
            row.style.display = ""; // Show the row if it matches
        } else {
            row.style.display = "none"; // Hide the row if it doesn't match
        }
    }
});

// Update row numbers after a row is deleted
function updateRowNumbers() {
    const rows = articleTableBody.getElementsByTagName("tr");
    Array.from(rows).forEach((row, index) => {
        row.cells[0].textContent = index + 1; // Update row number
    });
}
