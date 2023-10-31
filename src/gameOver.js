const gameOverScreen = `
  <section class="game-over">
    <h3 class="title">Game Over</h3>
    <section>
      Puntuación: <span class="total-score"></span>
    </section>
    <section class="input">
      Nombre: <input type="text" id="name-input" maxlength="10" />
    </section>
    <button id="upload-btn">Subir</button>
    <section class="top-title">
      Top 5:
      <section class="scores">
      </section>
    </section>
    <div class="btn-section">
      <button id="retry-btn">Otra vez?</button>
    </div>
  </section>
`

export { gameOverScreen }