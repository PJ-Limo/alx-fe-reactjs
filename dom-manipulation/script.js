document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteToArray = document.getElementById("add-quote");

    // Object constructor
    function Quote(text, category) {
        this.text = text;
        this.category = category;
    }
    // Initialize empty array
    let quotesObject = [];
    /*let quoteToDisplay = [];*/

    // Function to add new quote to array
    function addQuote() {
        // Reference values in text and category fields
        let newQuoteText = document.getElementById("newQuoteText").value.trim();
        let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        // check if text and category fields are not empty
        if (newQuoteText && newQuoteCategory) {
            // Create the new quote object
            const createAddQuoteForm = new Quote(newQuoteText, newQuoteCategory);
            // Once created push new quote object into array
            quotesObject.push(createAddQuoteForm);
            // Clear input fields
            newQuoteText = "";
            newQuoteCategory = "";
            console.log(quotesObject);
        } else {
            // if text or category is empty alert
            alert("Please enter some text and a category");
            return;
        }
    }

    // Function to generate and display random quote
    function showRandomQuote() {
        // Clear display
        quoteDisplay.innerHTML = "";
        // Check if quotes array is not empty
        if (quotesObject !== "") {
            // Choose a random number
            let randomNumber = Math.floor(Math.random() * quotesObject.length);
            console.log(randomNumber);
            /*quoteToDisplay.push(randomNumber);*/
            for (let i = 0; i < quotesObject.length; i++) {
                console.log(i);
                if (i === randomNumber) {
                    const quoteCard = document.createElement("div");
                    const quoteText = document.createElement("p");
                    const quoteCategory = document.createElement("p");

                    quoteCard.classList.add("card");
                    quoteText.classList.add("text");
                    quoteCategory.classList.add("category");

                    quoteText.innerText = `"${quotesObject[i].text}"`;
                    quoteCategory.innerText = `${quotesObject[i].category}`;

                    quoteCard.appendChild(quoteText);
                    quoteCard.appendChild(quoteCategory);

                    quoteDisplay.appendChild(quoteCard);
                    break;
                }
            }
        } else {
            alert("There are no quotes so there is nothing to display. Please add a quote first.");
        }
    }

    // When show new quote button is clicked show new quote
    newQuoteBtn.addEventListener("click", showRandomQuote);

    // Add new quote object to array
    addQuoteToArray.addEventListener("click", addQuote);
});

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        return serverQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const newQuote = await response.json();
        return newQuote;
    } catch (error) {
        console.error('Error posting quote to server:', error);
        return null;
    }
}

// Function to sync local data with the server
async function syncQuotes() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = await fetchQuotesFromServer();

    // Simple conflict resolution: server data takes precedence
    serverQuotes.forEach(serverQuote => {
        const categoryObj = localQuotes.find(q => q.category.toLowerCase() === serverQuote.category.toLowerCase());
        if (categoryObj) {
            const localQuote = categoryObj.quotes.find(q => q.text === serverQuote.text && q.author === serverQuote.author);
            if (localQuote) {
                // Conflict detected, resolve by taking server data
                localQuote.text = serverQuote.text;
                localQuote.author = serverQuote.author;
            } else {
                categoryObj.quotes.push({ text: serverQuote.text, author: serverQuote.author });
            }
        } else {
            localQuotes.push({
                category: serverQuote.category,
                quotes: [{ text: serverQuote.text, author: serverQuote.author }]
            });
        }
    });

    localStorage.setItem('quotes', JSON.stringify(localQuotes));
    notifyUser('Quotes synced with server!');
    populateCategories();
    filterQuotes();
}

// Periodic data fetching
setInterval(syncQuotes, 60000); // Sync every 60 seconds

// Function to notify user
function notifyUser(message) {
    const notificationDiv = document.getElementById('notification');
    notificationDiv.innerText = message;
}

// Function to manually resolve conflicts
async function resolveConflictsManually() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = await fetchQuotesFromServer();

    // Display conflicts and allow user to resolve them
    console.log('Local Quotes:', localQuotes);
    console.log('Server Quotes:', serverQuotes);
    notifyUser('Conflicts displayed in console for manual resolution.');
}

// Load quotes from local storage on initialization
loadQuotes();
populateCategories();

// Restore the last selected filter
const selectedCategory = localStorage.getItem('selectedCategory');
if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
    filterQuotes();
} else {
    filterQuotes();
}

// Periodically fetch quotes from the server
setInterval(fetchQuotesFromServer, 60000); // Fetch every 60 seconds

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize with a random quote
showRandomQuote();