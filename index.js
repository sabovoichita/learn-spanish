function $(selector) {
  return document.querySelector(selector);
}

function createStructure() {
  $("body").innerHTML = `
  <header>
    <h1>Learn Spanish<h1>
  </header>
  <div id ="container"></div>`;
}

function renderDivs(lessonNumber) {
  const container = $("#container");
  for (let i = 1; i <= lessonNumber; i++) {
    const lessonDiv = document.createElement("div");
    lessonDiv.id = `l${i}`;
    container.appendChild(lessonDiv);
  }
}

function showHeader() {
  return `
  
  <div id ="container"></div>
  `;
}

function showLesson(lessonNumber, lesson) {
  const spaceRender = $(`#l${lessonNumber}`);
  if (!spaceRender) {
    console.error(`Lesson #l${lessonNumber} not found.`);
    return;
  }

  var text = lesson.map((lesson) => {
    // console.info("inside map %o", lesson);
    return `
  <section>
    <h2 class = "h2Design">Chapter: ${lesson.chapter}. ${lesson.title}</h2>
    <div class = "displayLesson">
      <ul>${lesson.lessonS
        .map((contentItem) => `<li>${contentItem}</li>`)
        .join(" ")}</li> = ${lesson.lessonE
      .map((contentItem) => `<li>${contentItem}</li>`)
      .join(" ")}</ul>
    </div>
  </section>
    `;
  });
  console.warn("lesson is: %o", lessonNumber, text);
  spaceRender.innerHTML = text.join("");
}
// showLesson();

function loadLesson(lessonNumber) {
  fetch(`./data/${lessonNumber}.json`).then((r) => {
    r.json().then((lesson) => {
      // console.log(lesson);
      showLesson(lessonNumber, lesson);
    });
  });
}

createStructure();

function initEvents() {
  const numberOfLessons = 2;
  renderDivs(numberOfLessons);

  // Load all lessons and insert chapters as needed
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
}
initEvents();
