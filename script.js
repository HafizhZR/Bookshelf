const storageKey = "STORAGE_KEY";

function checkForStorage() {
    let storage = null;
    try {
        storage = window.localStorage;
        storage.setItem("test", "test");
        storage.removeItem("test");
        return true;
    } catch (e) {
        return false;
    }
}

window.addEventListener("load", function () {
    if (checkForStorage) {
        if (localStorage.getItem(storageKey) !== null) {
            const bookData = getBook();
            showBook(bookData);
        }
    } else {
        alert("Browser ini tidak mendukung Web Storage");
    }
});

const inputBook = document.getElementById("inputBook");
inputBook.addEventListener("submit", function () {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const idTemp = document.getElementById("inputBookTitle").name;
    if (idTemp !== "") {
        const bookData = getBook();
        for (let index = 0; index < bookData.length; index++) {
            if (bookData[index].id == idTemp) {
                bookData[index].title = title;
                bookData[index].author = author;
                bookData[index].year = year;
                bookData[index].isComplete = isComplete;
            }
        }
        localStorage.setItem(storageKey, JSON.stringify(bookData));
        resetForm();
        showBook(bookData);
        return;
    }
    const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
    const newBook = {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
    };
    putBook(newBook);
    const bookData = getBook();
    showBook(bookData);
    alert("Buku berhasil ditambahkan!")
});

function showBook(bookData) {
    if (bookData === null) {
        return;
    }
    const containerIncomplete = document.getElementById("incompleteBookshelfList");
    const containerComplete = document.getElementById("completeBookshelfList");
    containerIncomplete.innerHTML = "";
    containerComplete.innerHTML = "";
    for (let book of bookData) {
        const id = book.id;
        const title = book.title;
        const author = book.author;
        const year = book.year;
        const isComplete = book.isComplete;

        let bookItem = document.createElement("article");
        bookItem.classList.add("book_item", "select_item");
        bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
        bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
        bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

        let containerActionItem = document.createElement("div");
        containerActionItem.classList.add("action");

        const greenButton = createCheckButton(book, function (event) {
            completeBook(event.target.parentElement.parentElement);
            const bookData = getBook();
            resetForm();
            showBook(bookData);
        });

        const redButton = createDeleteButton(function (event) {
            deleteBook(event.target.parentElement.parentElement);
            const bookData = getBook();
            resetForm();
            showBook(bookData);
        });

        const blueButton = createUpdateButton(function (event) {
            updateBook(event.target.parentElement.parentElement);
            const bookData = getBook();
            resetForm();
            showBook(bookData);
        });

        containerActionItem.append(greenButton, redButton, blueButton);
        bookItem.append(containerActionItem);

        if (isComplete === false) {
            containerIncomplete.append(bookItem);
            bookItem.childNodes[0].addEventListener("click", function (event) {
                updateBook(event.target.parentElement);
            });
            continue;
        }

        if (isComplete === true) {
            containerComplete.append(bookItem);
            bookItem.childNodes[0].addEventListener("click", function (event) {
                updateBook(event.target.parentElement);
            });
        }
    }
}

function putBook(data) {
    if (checkForStorage()) {
        const storage = window.localStorage;
        let bookData = storage.getItem(storageKey);
        if (!bookData) {
            bookData = [];
        } else {
            bookData = JSON.parse(bookData);
        }
        bookData.push(data);
        storage.setItem(storageKey, JSON.stringify(bookData));
    }
}

function getBook() {
    if (checkForStorage) {
        return JSON.parse(localStorage.getItem(storageKey));
    }
    return [];
}

function resetForm() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
    document.getElementById("searchBookTitle").value = "";
}

function createCheckButton(book, eventListener) {
    const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.innerText = isSelesai + " di Baca";
    greenButton.addEventListener("click", function (event) {
        eventListener(event);
    });
    return greenButton;
}

function createDeleteButton(eventListener) {
    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.innerText = "Hapus buku";
    redButton.addEventListener("click", function (event) {
        eventListener(event);
    });
    return redButton;
}

function createUpdateButton(eventListener) {
    const blueButton = document.createElement("button");
    blueButton.classList.add("blue");
    blueButton.innerText = "Update buku";
    blueButton.addEventListener("click", function (event) {
        eventListener(event);
    });
    return blueButton;
}

document.getElementById('searchBookList').addEventListener("click", function (event) {
    event.preventDefault();
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItem = document.querySelectorAll('.book_item > h3');
    for (const book of bookItem) {
        if (book.innerText.toLowerCase().includes(searchBookTitle)) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
})

function completeBook(itemElement) {
    const bookData = getBook();
    if (bookData.length === 0) {
        return;
    }
    const title = itemElement.childNodes[0].innerText;
    const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
    for (let index = 0; index < bookData.length; index++) {
        if (bookData[index].title === title && bookData[index].id == titleNameAttribut) {
            bookData[index].isComplete = !bookData[index].isComplete;
            break;
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function deleteBook(itemElement) {
    const bookData = getBook();
    if (confirm("Apakah anda yakin ingin menghapus buku ini?")) {
        if (bookData.length === 0) {
            return;
        }
        const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
        for (let index = 0; index < bookData.length; index++) {
            if (bookData[index].id == titleNameAttribut) {
                bookData.splice(index, 1);
                break;
            }
        }
        localStorage.setItem(storageKey, JSON.stringify(bookData));
    }
}

function updateBook(itemElement) {
    const updateButton = document.createElement("button");
    updateButton.classList.add("blue");
    updateButton.innerText = "Update Buku";
    updateButton.addEventListener("click", function (event) {
        eventListener(event);
    });
    const title = itemElement.childNodes[0].innerText;
    const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
    const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
    const year = parseInt(getYear);
    const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;
    const id = itemElement.childNodes[0].getAttribute("name");

    document.getElementById("inputBookTitle").value = title;
    document.getElementById("inputBookTitle").name = id;
    document.getElementById("inputBookAuthor").value = author;
    document.getElementById("inputBookYear").value = year;
    document.getElementById("inputBookIsComplete").checked = isComplete;

    for (let index = 0; index < bookData.length; index++) {
        if (bookData[index].id == id) {
            bookData[index].id = id;
            bookData[index].title = title;
            bookData[index].author = author;
            bookData[index].year = year;
            bookData[index].isComplete = isComplete;
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
}