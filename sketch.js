/* Listas de emojis da cidade e do campo */
let cidadeEmojis = ["🏢", "🏬", "🏫", "🏙️", "🏦", "🚦", "🚇", "🚍", "🚕", "🚓", "🚒", "🏠", "🏡", "🏤", "🏛️", "🏗️", "🛣️", "🏭", "🗼", "🏚️"];
let campoEmojis = ["🌾", "🚜", "🐄", "🐖", "🐓", "🐑", "🌻", "🌳", "🐎", "🐕", "🌞", "🛶", "🌽", "🏕️", "🌿", "🐐", "🐂", "🐣", "🪵", "🪴"];

// Lista com todos os elementos da tela
let elementos = [];
let energia = 0;               // Pontuação (energia sustentável gerada)
let tempoRestante = 30;        // Tempo total de jogo (segundos)
let tempoUltimaAtualizacao = 0; // Para controle da troca de emojis
let tempoAtual;
let estado = "jogando";        // Pode ser "jogando" ou "final"
let nivelCampo = 0;            // Nível da fazenda ao final

// Descrição visual dos níveis da fazenda com base na energia
let campoNiveis = [
  "🌱 - Broto no solo",
  "🌿 - Plantas crescendo",
  "🌾 - Colheita iniciada",
  "🐄🌾 - Fazendinha com animais",
  "🚜🌞 - Agricultura limpa",
  "🌳🐄🚜🌞 - Fazenda sustentável total"
];

// Configuração inicial (chamada uma vez)
function setup() {
  createCanvas(800, 600);         // Define tamanho da tela
  textAlign(CENTER, CENTER);      // Alinha textos ao centro
  textSize(32);                   // Tamanho padrão do texto
  reiniciarJogo();                // Cria os emojis iniciais
  tempoAtual = millis();          // Marca o tempo inicial
}

// Função chamada várias vezes por segundo (loop principal)
function draw() {
  background("#e6faff"); // Cor de fundo (azul claro)

  if (estado === "jogando") {
    // Cabeçalho com instruções e informações
    fill(0);
    textSize(26);
    text("Clique nas coisas da cidade para gerar ⚡ energia!", width / 2, 30);
    textSize(20);
    text("Energia Sustentável: ⚡ " + energia, width / 2, 65);
    text("⏱️ Tempo restante: " + tempoRestante + "s", width / 2, 95);

    // Atualiza tempo a cada 1 segundo
    if (millis() - tempoAtual >= 1000) {
      tempoRestante--;
      tempoAtual = millis(); // Reseta o cronômetro

      // Quando o tempo acabar, mostrar tela final
      if (tempoRestante <= 0) {
        estado = "final";
        // Define o nível da fazenda com base na energia (de 0 a 5)
        nivelCampo = min(floor(energia / 4), campoNiveis.length - 1);
      }
    }

    // Troca os emojis visíveis a cada 3 segundos
    if (millis() - tempoUltimaAtualizacao >= 3000) {
      for (let e of elementos) {
        if (!e.clicado) {
          e.emoji = e.tipo === "cidade" ? random(cidadeEmojis) : random(campoEmojis);
        }
      }
      tempoUltimaAtualizacao = millis(); // Atualiza o tempo da última troca
    }

    // Mostra e movimenta os emojis
    for (let e of elementos) {
      if (!e.clicado) {
        textSize(32);
        text(e.emoji, e.x, e.y);
        moverElemento(e); // Aplica movimento
      }
    }
  }

  else if (estado === "final") {
    // Tela final com resumo da energia e evolução do campo
    background("#d0f0c0"); // Verde claro
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

// Detecta cliques do mouse
function mousePressed() {
  if (estado === "jogando") {
    // Verifica se clicou em algum emoji visível
    for (let e of elementos) {
      if (!e.clicado && dist(mouseX, mouseY, e.x, e.y) < 30) {
        e.clicado = true; // Marca como clicado
        if (e.tipo === "cidade") {
          energia++; // Só ganha energia clicando na cidade
        }
        break;
      }
    }
  } else if (estado === "final") {
    // Se clicar na tela final, reinicia o jogo
    reiniciarJogo();
  }
}

// Cria um novo objeto emoji com posição e movimento
function criarElemento(emoji, tipo) {
  return {
    emoji,        // O símbolo visual
    tipo,         // "cidade" ou "campo"
    clicado: false, // Se já foi clicado
    x: random(40, width - 40),  // Posição X aleatória
    y: random(120, height - 40),// Posição Y aleatória
    vx: random(-2, 2),          // Velocidade X
    vy: random(-2, 2)           // Velocidade Y
  };
}

// Faz o emoji se mover e rebater nas bordas
function moverElemento(e) {
  e.x += e.vx;
  e.y += e.vy;

  if (e.x < 20 || e.x > width - 20) e.vx *= -1;
  if (e.y < 100 || e.y > height - 20) e.vy *= -1;
}

// Reinicia todos os valores do jogo
function reiniciarJogo() {
  energia = 0;
  tempoRestante = 30;
  estado = "jogando";
  elementos = [];

  // Cria 20 emojis da cidade + 20 do campo
  for (let i = 0; i < 20; i++) {
    elementos.push(criarElemento(random(cidadeEmojis), "cidade"));
    elementos.push(criarElemento(random(campoEmojis), "campo"));
  }

  tempoUltimaAtualizacao = millis(); // Marca o tempo da primeira troca
}
