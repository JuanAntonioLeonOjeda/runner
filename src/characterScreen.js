const characterScreen = `
  <section class="title-container">
    <h1 class="title">Elige personaje</h1>
    <div class="help-container">
      <img class="help-icon" src="./assets/question.png" alt="Ayuda">
    </div>
  </section>
  <section id="characters">
    <div class="character-select">
      <h3 class="name">Tati</h3>
      <div class="container">
        <img class="person" src="./assets/characters/tati/main.png">
      </div>
      <div class="text-container">
        <span class="text">Cae más lento</span>
      </div>
    </div>
    <div class="character-select">
      <h3 class="name">Juanan</h3>
      <div class="container">
        <img class="person" src="./assets/characters/juanan/main.png">
      </div>
      <div class="text-container">
        <span class="text">Suenan temazos</span>
      </div>
    </div>
    <div class="character-select">
      <h3 class="name">Kimchi</h3>
      <div class="container">
        <div class="kimchi" ></div>
      </div>
      <div class="text-container">
        <span class="text">Salta más alto</span>
      </div>
    </div>
  </section>
  <section id="help-section">
    <div id="help-title">
      <p id="help-title-text">
        ¿CÓMO JUGAR?
      </p>
      <p id="close-help">
        [X]
      </p>
    </div>
    <div id="help-intro">
      <p class="help-text">
        Llegamos tarde a la boda! Ayúdanos a llegar a tiempo esquivando los obstáculos!
      </p>
      <div class="icons-display">
        <img src="./assets/enemies/email.png" alt="email">
        <img src="./assets/enemies/baby1.png" alt="baby">
      </div>
      <p class="help-text">
        Pulsa sobre la pantalla para saltar. Cuanto más tiempo dejes pulsado, más saltarás.
      </p>
      <p class="help-text">
      Coge los objetos de bonus para conseguir más puntos.
      </p>
      <div class="icons-display">
        <img src="./assets/bonus/chocolate.png" alt="chocolate">
        <img src="./assets/bonus/coffee.png" alt="coffee">
        <img src="./assets/bonus/fish.png" alt="fish">
      </div>
    </div>
  </section>
`;

export { characterScreen }