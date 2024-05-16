content = {
  chapter: "1",
  title: "Formule de salut",
  contentR1: ["Bună ziua."],
  contentS1: ["¡Buenos días!"],
};

function $(selector) {
  return document.querySelector(selector);
}

function HTMLContent() {
  return `
  <header>
  <h1>Română - Spaniolă<h1>
  </header>
  <section>
  <h2 class = "h2Design">${content.chapter}. ${content.title}</h2>
  <div class = "displayContent"><p>${content.contentR1}</p> <hr/> <p>${content.contentS1}</p>
  </div>
  </section>
  `;
}

function displayContent() {
  const place = $("body");
  place.innerHTML = HTMLContent();
}

function initEvents() {
  displayContent();
}

initEvents();
