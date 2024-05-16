console.log("Welcome!");
content = {
  chapter: "1",
  title: "Formule de salut",
  contentR1: ["Bună ziua.", "ceva"],
  contentS1: ["¡Buenos días!", "altceva"],
};

function $(selector) {
  return document.querySelector(selector);
}

function HTMLContent() {
  console.log("here");
  return `<h1>Română - Spaniolă<h1>
  <h2 class = "here">${content.chapter}. ${content.title}</h2>
  <p>${content.contentR1.map((a) => a)}</p> <hr/> <p>${content.contentS1}</p>`;
}

function displayContent() {
  const place = $("body");
  //   console.log((place.innerHTML = HTMLContent()));
  place.innerHTML = HTMLContent();
}

function initEvents() {
  displayContent();
}

initEvents();
