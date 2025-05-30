
let cidadeEmojis = ["🏢", "🏬", "🏫", "🏙️", "🏦", "🚦", "🚇", "🚍", "🚕", "🚓", "🚒", "🏠", "🏡", "🏤", "🏛️", "🏗️", "🛣️", "🏭", "🗼", "🏚️"];
let campoEmojis = ["🌾", "🚜", "🐄", "🐖", "🐓", "🐑", "🌻", "🌳", "🐎", "🐕", "🌞", "🛶", "🌽", "🏕️", "🌿", "🐐", "🐂", "🐣", "🪵", "🪴"];
let elementos = [];
let energia = 0;
let tempoRestante = 30; // em segundos
let tempoUltimaAtualizacao = 0;
let tempoAtual;
let estado = "jogando";
let nivelCampo = 0;
let campoNiveis = [
  "🌱 - Broto no solo",
  "🌿 - Plantas crescendo",
  "🌾 - Colheita iniciada",
  "🐄🌾 - Fazendinha com animais",
  "🚜🌞 - Agricultura limpa",
  "🌳🐄🚜🌞 - Fazenda sustentável total"
];

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(32);
  reiniciarJogo();
  tempoAtual = millis();
}

function draw() {
  background("#e6faff");

  if (estado === "jogando") {
    fill(0);
    textSize(26);
    text("Clique nas coisas da cidade para gerar ⚡ energia!", width / 2, 30);
    textSize(20);
    text("Energia Sustentável: ⚡ " + energia, width / 2, 65);
    text("⏱️ Tempo restante: " + tempoRestante + "s", width / 2, 95);

    // Atualiza tempo
    if (millis() - tempoAtual >= 1000) {
      tempoRestante--;
      tempoAtual = millis();
      if (tempoRestante <= 0) {
        estado = "final";
        nivelCampo = min(floor(energia / 4), campoNiveis.length - 1);
      }
    }

    // Atualizar emojis a cada 3 segundos
    if (millis() - tempoUltimaAtualizacao >= 3000) {
      for (let e of elementos) {
        if (!e.clicado) {
          e.emoji = e.tipo === "cidade" ? random(cidadeEmojis) : random(campoEmojis);
        }
      }
      tempoUltimaAtualizacao = millis();
    }

    for (let e of elementos) {
      if (!e.clicado) {
        textSize(32);
        text(e.emoji, e.x, e.y);
        moverElemento(e);
      }
    }
  }

  else if (estado === "final") {
    background("#d0f0c0");
    fill(0);
    textSize(28);
    text("Energia Sustentável Gerada: ⚡ " + energia, width / 2, 80);
    text("Impacto no campo:", width / 2, 120);
    textSize(40);
    text(campoNiveis[nivelCampo], width / 2, height / 2);
    textSize(22);
    text("🌎 Obrigado por apoiar a energia limpa!", width / 2, height / 2 + 60);
    text("Clique para jogar de novo", width / 2, height - 40);
  }
}

function mousePressed() {
  if (estado === "jogando") {
    for (let e of elementos) {
      if (!e.clicado && dist(mouseX, mouseY, e.x, e.y) < 30) {
        e.clicado = true;
        if (e.tipo === "cidade") {
          energia++;
        }
        break;
      }
    }
  } else if (estado === "final") {
    reiniciarJogo();
  }
}

function criarElemento(emoji, tipo) {
  return {
    emoji,
    tipo,
    clicado: false,
    x: random(40, width - 40),
    y: random(120, height - 40),
    vx: random(-2, 2),
    vy: random(-2, 2)
  };
}

function moverElemento(e) {
  e.x += e.vx;
  e.y += e.vy;

  if (e.x < 20 || e.x > width - 20) e.vx *= -1;
  if (e.y < 100 || e.y > height - 20) e.vy *= -1;
}

function reiniciarJogo() {
  energia = 0;
  tempoRestante = 30;
  estado = "jogando";
  elementos = [];

  for (let i = 0; i < 20; i++) {
    elementos.push(criarElemento(random(cidadeEmojis), "cidade"));
    elementos.push(criarElemento(random(campoEmojis), "campo"));
  }
  tempoUltimaAtualizacao = millis();
}

