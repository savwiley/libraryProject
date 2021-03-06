//LIBRARY
let myLibrary = [];

//GRABBING DIVS
const displayLibrary = document.querySelector(".library");
const loading = document.querySelector(".loading");
const sorter = document.querySelector("#sorter");

//SORTER
sorter.addEventListener("change", () => {
  let books = document.querySelectorAll("#book");
  books.forEach((e) => {
    e.remove();
    loading.style.display = "block";
  });
  if (sorter.value === "titleZA") {
    getArr("title", true);
  } else if (sorter.value === "authorZA") {
    getArr("author", true);
  } else if (sorter.value === "wordsZA") {
    getArr("words", true);
  } else if (sorter.value === "readCountZA") {
    getArr("readCount", true);
  } else {
    getArr(sorter.value, null);
  }
});

//VALIDATES FORM
const iTitle = document.getElementById("bookTitle");
const iAuthor = document.getElementById("author");
const iWords = document.getElementById("words");
const subBtn = document.getElementById("subBtn");

iTitle.addEventListener("input", () => {
  if (iTitle.validity.tooShort) {
    iTitle.setCustomValidity("Please input a title.");
  } else {
    iTitle.setCustomValidity("");
  }
});

iAuthor.addEventListener("input", () => {
  if (iAuthor.validity.tooShort) {
    iAuthor.setCustomValidity("Please input an author.");
  } else {
    iAuthor.setCustomValidity("");
  }
});

iWords.addEventListener("input", () => {
  if (iWords.validity.rangeUnderflow) {
    iWords.setCustomValidity("Please input page numbers.");
  } else {
    iWords.setCustomValidity("");
  }
});

let edit;
let editReaders = 0;
subBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (edit) {
    const element = document.querySelector(`div[data-i="${edit}"]`);
    const titleDiv = element.querySelector("#title");
    deleteBook(titleDiv.textContent);
    element.remove();
    edit = null;
  }
  if (
    iTitle.validity.valid &&
    iAuthor.validity.valid &&
    iWords.validity.valid
  ) {
    new Book(iTitle.value, iAuthor.value, iWords.value, editReaders);
    storeArr();
    iTitle.value = "";
    iAuthor.value = "";
    iWords.value = "";
    editReaders = 0;
  }
});

//gets random color
const randColor = () => {
  const color = Math.floor(Math.random() * 230);
  return color;
};

//STORES BOOKS IN LIBRARY ARRAY
function Book(title, author, words, readCount = 0) {
  (this.title = title),
    (this.author = author),
    (this.words = words),
    (this.readCount = readCount);

  myLibrary.push({ title, author, words, readCount });
  let index = myLibrary.length - 1;

  //create card
  const displayBook = document.createElement("div");
  displayBook.style.background = `linear-gradient(130deg, #ebebeb, rgba(${randColor()}, ${randColor()}, ${randColor()}))`;
  displayLibrary.appendChild(displayBook);
  displayBook.setAttribute("id", "book");
  displayBook.setAttribute("data-i", myLibrary.length);

  //create edit button
  const editBtn = document.createElement("i");
  editBtn.setAttribute("class", "far fa-edit");
  editBtn.setAttribute("title", "Edit");
  editBtn.setAttribute("data-i", myLibrary.length);
  editBtn.addEventListener("click", editButton);
  function editButton(e) {
    iTitle.value = title;
    iAuthor.value = author;
    iWords.value = words;
    edit = e.path[0].dataset.i;
    editReaders = myLibrary[index].readCount;
  }
  displayBook.appendChild(editBtn);

  //create delete button
  const delBtn = document.createElement("button");
  displayBook.appendChild(delBtn);
  delBtn.textContent = "X";
  delBtn.setAttribute("id", "delete");
  delBtn.setAttribute("title", "Delete");
  delBtn.setAttribute("data-i", myLibrary.length);
  delBtn.addEventListener("click", deleteButton);
  function deleteButton() {
    const btnNumb = delBtn.getAttribute("data-i");
    const del = document.querySelector(`div[data-i="${btnNumb}"]`);
    del.remove();
    deleteBook(title);
  }

  //create card content
  //link
  const linkTitle = title.split(" ").join("+");
  const bookLink = document.createElement("a");
  bookLink.setAttribute(
    "href",
    `https://www.google.com/search?q=${linkTitle}+novel`
  );
  bookLink.setAttribute("title", `Google Search: ${title}`);
  displayBook.appendChild(bookLink);
  //title
  const displayBookTitle = document.createElement("div");
  bookLink.appendChild(displayBookTitle);
  displayBookTitle.setAttribute("id", "title");
  displayBookTitle.textContent = title;
  //author
  const displayBookAuthor = document.createElement("div");
  displayBook.appendChild(displayBookAuthor);
  displayBookAuthor.setAttribute("id", "author");
  displayBookAuthor.textContent = author;
  //word count
  const displayBookPages = document.createElement("div");
  displayBook.appendChild(displayBookPages);
  displayBookPages.setAttribute("id", "words");
  const wordNumb = words.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  displayBookPages.textContent = `${wordNumb} words`;

  //read count
  const displayBookCount = document.createElement("div");
  displayBook.appendChild(displayBookCount);
  displayBookCount.setAttribute("id", "readCount");
  displayBookCount.textContent = `read by ${readCount} users`;
  //read count btn
  const readCountBtn = document.createElement("button");
  displayBook.appendChild(readCountBtn);
  readCountBtn.setAttribute("id", "readBtn");
  readCountBtn.setAttribute("title", "I've Read This!");
  readCountBtn.textContent = "I've Read This!";
  readCountBtn.addEventListener("click", () => {
    myLibrary[index].readCount += 1;
    displayBookCount.textContent = `read by ${readCount + 1} users`;
    readCountBtn.remove();
    storeArr();
  });
}

//FIRESTORE
async function getArr(order, desc) {
  let docs;
  if (desc === true) {
    try {
      docs = await firebase
        .firestore()
        .collection("Books")
        .orderBy(order, "desc")
        .get();
    } catch (err) {
      alert(
        `Something went wrong! Please use the link at the bottom of this page to submit an issue with this error & what you were trying to do: ${err}`
      );
    }
  } else {
    try {
      docs = await firebase
        .firestore()
        .collection("Books")
        .orderBy(order)
        .get();
    } catch (err) {
      alert(
        `Something went wrong! Please use the link at the bottom of this page to submit an issue with this error & what you were trying to do: ${err}`
      );
    }
  }
  docs.forEach((e) => {
    new Book(
      e.data().title,
      e.data().author,
      e.data().words,
      e.data().readCount
    );
  });
  loading.style.display = "none";
}
getArr("title", null);

async function deleteBook(title) {
  try {
    await firebase.firestore().collection("Books").doc(title).delete();
  } catch (err) {
    alert(
      `Something went wrong! Please use the link at the bottom of this page to submit an issue with this error & what you were trying to do: ${err}`
    );
  }
}

async function storeArr() {
  for (let i = 0; i < myLibrary.length; i++) {
    let data = {
      title: myLibrary[i].title,
      author: myLibrary[i].author,
      words: Number(myLibrary[i].words),
      readCount: myLibrary[i].readCount,
    };
    try {
      await firebase.firestore().collection("Books").doc(data.title).set(data);
    } catch (err) {
      alert(
        `Something went wrong! Please use the link at the bottom of this page to submit an issue with this error & what you were trying to do: ${err}`
      );
    }
  }
}
