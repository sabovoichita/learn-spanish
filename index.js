content = {
  chapter: "1",
  title: "Formule de salut",
  contentR1: ["Bună ziua."],
  contentS1: ["¡Buenos días!"],
};

function $(selector) {
  return document.querySelector(selector);
}

function showContent(contents) {
  var ul = $("body");
  var contents = ["1", "Formule de salut", "Bună ziua.", "¡Buenos días!"];
  // console.info(contents);
  var text = contents.map((content) => {
    // console.info("inside map %o", content);
    return `<p>${contents}</p>
    `;
  });
  console.warn(text);
  ul.innerHTML = text.join("");
}
showContent();

function loadContent() {
  fetch("./data/1.json").then((r) => {
    r.json().then((d) => {
      console.log(d);
      displayContent(d);
    });
  });
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

function displayContent(d) {
  const place = $("body");
  place.innerHTML = HTMLContent(d);
}

function initEvents() {
  loadContent();
  displayContent();
}

initEvents();
