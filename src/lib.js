//LIBRARY
let myLibrary = [];

//GRABBING DIVS
const displayLibrary = document.querySelector(".library");
const loading = document.querySelector(".loading");

//BOOK OBJECT

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
    new Book(iTitle.value, iAuthor.value, iWords.value);
    storeArr();
    iTitle.value = "";
    iAuthor.value = "";
    iWords.value = "";
  }
});

//gets random color
const randColor = () => {
  const color = Math.floor(Math.random() * 230);
  return color;
};

//STORES BOOKS IN LIBRARY ARRAY
function Book(title, author, words) {
  (this.title = title), (this.author = author), (this.words = words);

  myLibrary.push({ title, author, words });

  //create card
  const displayBook = document.createElement("div");
  displayBook.style.background = `linear-gradient(130deg, #ebebeb, rgba(${randColor()}, ${randColor()}, ${randColor()}))`;
  displayLibrary.appendChild(displayBook);
  displayBook.setAttribute("id", "book");
  displayBook.setAttribute("data-i", myLibrary.length);

  //create edit button
  const editBtn = document.createElement("i");
  editBtn.setAttribute("class", "far fa-edit");
  editBtn.setAttribute("data-i", myLibrary.length);
  editBtn.addEventListener("click", editButton);
  function editButton(e) {
    iTitle.value = title;
    iAuthor.value = author;
    iWords.value = words;
    edit = e.path[0].dataset.i;
  }
  displayBook.appendChild(editBtn);

  //create delete button
  const delBtn = document.createElement("button");
  displayBook.appendChild(delBtn);
  delBtn.textContent = "X";
  delBtn.setAttribute("id", "delete");
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

  //create read check
  //currently not remembered in server
  const check = document.createElement("input");
  displayBook.appendChild(check);
  check.setAttribute("type", "checkbox");
  check.setAttribute("id", "read");
  const label = document.createElement("label");
  displayBook.appendChild(label);
  label.setAttribute("for", "read");
  label.textContent = "Finished?";
}

//FIRESTORE
async function getArr() {
  const docs = await firebase.firestore().collection("Books").get();
  docs.forEach((e) => {
    new Book(e.data().title, e.data().author, e.data().words);
  });
  loading.remove();
}
getArr();

async function deleteBook(title) {
  await firebase.firestore().collection("Books").doc(title).delete();
}

async function storeArr() {
  for (let i = 0; i < myLibrary.length; i++) {
    let data = {
      title: myLibrary[i].title,
      author: myLibrary[i].author,
      words: myLibrary[i].words,
    };
    await firebase.firestore().collection("Books").doc(data.title).set(data);
  }
}