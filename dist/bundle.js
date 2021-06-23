/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib.js":
/*!********************!*\
  !*** ./src/lib.js ***!
  \********************/
/***/ (() => {

eval("//LIBRARY\nlet myLibrary = [];\n\n//GRABBING DIVS\nconst displayLibrary = document.querySelector(\".library\");\nconst loading = document.querySelector(\".loading\");\n\n//BOOK OBJECT\n\n//VALIDATES FORM\nconst iTitle = document.getElementById(\"bookTitle\");\nconst iAuthor = document.getElementById(\"author\");\nconst iWords = document.getElementById(\"words\");\nconst subBtn = document.getElementById(\"subBtn\");\n\niTitle.addEventListener(\"input\", () => {\n  if (iTitle.validity.tooShort) {\n    iTitle.setCustomValidity(\"Please input a title.\");\n  } else {\n    iTitle.setCustomValidity(\"\");\n  }\n});\n\niAuthor.addEventListener(\"input\", () => {\n  if (iAuthor.validity.tooShort) {\n    iAuthor.setCustomValidity(\"Please input an author.\");\n  } else {\n    iAuthor.setCustomValidity(\"\");\n  }\n});\n\niWords.addEventListener(\"input\", () => {\n  if (iWords.validity.rangeUnderflow) {\n    iWords.setCustomValidity(\"Please input page numbers.\");\n  } else {\n    iWords.setCustomValidity(\"\");\n  }\n});\n\nlet edit;\nlet editReaders = 0;\nsubBtn.addEventListener(\"click\", (e) => {\n  e.preventDefault();\n  if (edit) {\n    const element = document.querySelector(`div[data-i=\"${edit}\"]`);\n    const titleDiv = element.querySelector(\"#title\");\n    deleteBook(titleDiv.textContent);\n    element.remove();\n    edit = null;\n  }\n  if (\n    iTitle.validity.valid &&\n    iAuthor.validity.valid &&\n    iWords.validity.valid\n  ) {\n    new Book(iTitle.value, iAuthor.value, iWords.value, editReaders);\n    console.log(editReaders);\n    storeArr();\n    iTitle.value = \"\";\n    iAuthor.value = \"\";\n    iWords.value = \"\";\n    editReaders = 0;\n  }\n});\n\n//gets random color\nconst randColor = () => {\n  const color = Math.floor(Math.random() * 230);\n  return color;\n};\n\n//STORES BOOKS IN LIBRARY ARRAY\nfunction Book(title, author, words, readCount = 0) {\n  (this.title = title), (this.author = author), (this.words = words), (this.readCount = readCount);\n\n  myLibrary.push({ title, author, words, readCount });\n  let index = myLibrary.length - 1;\n\n  //create card\n  const displayBook = document.createElement(\"div\");\n  displayBook.style.background = `linear-gradient(130deg, #ebebeb, rgba(${randColor()}, ${randColor()}, ${randColor()}))`;\n  displayLibrary.appendChild(displayBook);\n  displayBook.setAttribute(\"id\", \"book\");\n  displayBook.setAttribute(\"data-i\", myLibrary.length);\n\n  //create edit button\n  const editBtn = document.createElement(\"i\");\n  editBtn.setAttribute(\"class\", \"far fa-edit\");\n  editBtn.setAttribute(\"data-i\", myLibrary.length);\n  editBtn.addEventListener(\"click\", editButton);\n  function editButton(e) {\n    iTitle.value = title;\n    iAuthor.value = author;\n    iWords.value = words;\n    edit = e.path[0].dataset.i;\n    editReaders = myLibrary[index].readCount;\n    console.log(editReaders);\n  }\n  displayBook.appendChild(editBtn);\n\n  //create delete button\n  const delBtn = document.createElement(\"button\");\n  displayBook.appendChild(delBtn);\n  delBtn.textContent = \"X\";\n  delBtn.setAttribute(\"id\", \"delete\");\n  delBtn.setAttribute(\"data-i\", myLibrary.length);\n  delBtn.addEventListener(\"click\", deleteButton);\n  function deleteButton() {\n    const btnNumb = delBtn.getAttribute(\"data-i\");\n    const del = document.querySelector(`div[data-i=\"${btnNumb}\"]`);\n    del.remove();\n    deleteBook(title);\n  }\n\n  //create card content\n  //link\n  const linkTitle = title.split(\" \").join(\"+\");\n  const bookLink = document.createElement(\"a\");\n  bookLink.setAttribute(\n    \"href\",\n    `https://www.google.com/search?q=${linkTitle}+novel`\n  );\n  displayBook.appendChild(bookLink);\n  //title\n  const displayBookTitle = document.createElement(\"div\");\n  bookLink.appendChild(displayBookTitle);\n  displayBookTitle.setAttribute(\"id\", \"title\");\n  displayBookTitle.textContent = title;\n  //author\n  const displayBookAuthor = document.createElement(\"div\");\n  displayBook.appendChild(displayBookAuthor);\n  displayBookAuthor.setAttribute(\"id\", \"author\");\n  displayBookAuthor.textContent = author;\n  //word count\n  const displayBookPages = document.createElement(\"div\");\n  displayBook.appendChild(displayBookPages);\n  displayBookPages.setAttribute(\"id\", \"words\");\n  const wordNumb = words.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\");\n  displayBookPages.textContent = `${wordNumb} words`;\n\n  //read count\n  const displayBookCount = document.createElement(\"div\");\n  displayBook.appendChild(displayBookCount);\n  displayBookCount.setAttribute(\"id\", \"readCount\");\n  displayBookCount.textContent = `read by ${readCount} users`;\n  //read count btn\n  const readCountBtn = document.createElement(\"button\");\n  displayBook.appendChild(readCountBtn);\n  readCountBtn.setAttribute(\"id\", \"readBtn\");\n  readCountBtn.textContent = \"I've Read This!\";\n  readCountBtn.addEventListener(\"click\", () => {\n    myLibrary[index].readCount += 1;\n    displayBookCount.textContent = `read by ${readCount + 1} users`;\n    readCountBtn.remove();\n    storeArr();\n  })\n\n}\n\n//FIRESTORE\nasync function getArr() {\n  const docs = await firebase.firestore().collection(\"Books\").get();\n  docs.forEach((e) => {\n    new Book(e.data().title, e.data().author, e.data().words, e.data().readCount);\n  });\n  loading.remove();\n}\ngetArr();\n\nasync function deleteBook(title) {\n  await firebase.firestore().collection(\"Books\").doc(title).delete();\n}\n\nasync function storeArr() {\n  for (let i = 0; i < myLibrary.length; i++) {\n    let data = {\n      title: myLibrary[i].title,\n      author: myLibrary[i].author,\n      words: myLibrary[i].words,\n      readCount: myLibrary[i].readCount,\n    };\n    await firebase.firestore().collection(\"Books\").doc(data.title).set(data);\n  }\n}\n\n//# sourceURL=webpack://libraryproject/./src/lib.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/lib.js"]();
/******/ 	
/******/ })()
;