  // Lista de 20 emojis da cidade
  let cidadeEmojis = ["🏢", "🏬", "🏫", "🏙️", "🏦", "🚦", "🚇", "🚍", "🚕", "🚓", "🚒", "🏠", "🏡", "🏤", "🏛️", "🏗️", "🛣️", "🏭", "🗼", "🏚️"];

  // Lista de 20 emojis do campo
  let campoEmojis = ["🌾", "🚜", "🐄", "🐖", "🐓", "🐑", "🌻", "🌳", "🐎", "🐕", "🌞", "🛶", "🌽", "🏕️", "🌿", "🐐", "🐂", "🐣", "🪵", "🪴"];

  let elementos = []; // Todos os emojis visuais (campo + cidade)
  let energia = 0; // Pontuação: representa energia sustentável
  let tempoRestante = 30; // Tempo do jogo em segundos
  let tempoAtual; // Armazena o último tempo contado
  let tempoUltimaAtualizacao = 0; // Controle para atualizar os emojis
  let estado = "jogando"; // Pode ser "jogando" ou "final"
  let nivelCampo = 0; // Qual estágio o campo vai evoluir
  let cidadeClicados = 0; // Quantos emojis da cidade já foram clicados

  // Fases visuais do campo no final do jogo
  let campoNiveis = [
    "🌱 - Broto no solo",
    "🌿 - Plantas crescendo",
    "🌾 - Colheita iniciada",
    "🐄🌾 - Fazendinha com animais",
    "🚜🌞 - Agricultura limpa",
    "🌳🐄🚜🌞 - Fazenda sustentável total"
  ];

  function setup() {
    createCanvas(800, 600); // Cria uma tela de 800x600 pixels
    textAlign(CENTER, CENTER); // Alinha os textos no centro
    textSize(32); // Tamanho da fonte padrão
    reiniciarJogo(); // Começa o jogo do zero
    tempoAtual = millis(); // Marca o tempo inicial
  }

  function draw() {
    background("#e6faff"); // Cor de fundo azul claro

    if (estado === "jogando") {
      // Mostra título e informações
      fill(0);
      textSize(26);
      text("Clique nas coisas da cidade para gerar ⚡ energia!", width / 2, 30);
      textSize(20);
      text("Energia Sustentável: ⚡ " + energia, width / 2, 65);
      text("⏱️ Tempo restante: " + tempoRestante + "s", width / 2, 95);
      text("Cidade clicadas: " + cidadeClicados + " / 20", width / 2, 125);

      // Atualiza o tempo a cada segundo
      if (millis() - tempoAtual >= 1000) {
        tempoRestante--;
        tempoAtual = millis(); // Atualiza o relógio
        if (tempoRestante <= 0) {
          estado = "final"; // Acaba o jogo
          calcularEvolucaoCampo(); // Define o nível final do campo
        }
      }

      // Troca os emojis visuais a cada 3 segundos
      if (millis() - tempoUltimaAtualizacao >= 3000) {
        for (let e of elementos) {
          if (!e.clicado) {
            e.emoji = e.tipo === "cidade" ? random(cidadeEmojis) : random(campoEmojis);
          }
        }
        tempoUltimaAtualizacao = millis(); // Atualiza o tempo da última troca
      }

      // Desenha todos os emojis ainda não clicados e os movimenta
      for (let e of elementos) {
        if (!e.clicado) {
          textSize(32);
          text(e.emoji, e.x, e.y);
          moverElemento(e); // Aplica movimento ao emoji
        }
      }
    }

    // Tela final (vitória ou fim do tempo)
    else if (estado === "final") {
      background("#d0f0c0"); // Fundo verde
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

  // Quando o jogador clica na tela
  function mousePressed() {
    if (estado === "jogando") {
      for (let e of elementos) {
        // Verifica se clicou perto do emoji
        if (!e.clicado && dist(mouseX, mouseY, e.x, e.y) < 30) {
          e.clicado = true;

          if (e.tipo === "cidade") {
            energia++; // Ganha energia
            cidadeClicados++;
            if (cidadeClicados >= 20) {
              estado = "final"; // Vitória antecipada
              calcularEvolucaoCampo();
            }
          } else if (e.tipo === "campo") {
            energia = max(0, energia - 1); // Perde energia (mínimo 0)
          }
          break;
        }
      }
    } else if (estado === "final") {
      reiniciarJogo(); // Se clicar na tela após fim, recomeça o jogo
    }
  }

  // Cria um emoji na tela
  function criarElemento(emoji, tipo) {
    return {
      emoji,             // Qual emoji mostrar
      tipo,              // cidade ou campo
      clicado: false,    // Ainda não foi clicado
      x: random(40, width - 40),  // Posição x aleatória
      y: random(150, height - 40),// Posição y aleatória
      vx: random(-2, 2), // Velocidade x
      vy: random(-2, 2)  // Velocidade y
    };
  }

  // Faz o emoji se mover e rebater nas bordas
  function moverElemento(e) {
    e.x += e.vx;
    e.y += e.vy;

    // Rebater nas bordas horizontais e verticais
    if (e.x < 20 || e.x > width - 20) e.vx *= -1;
    if (e.y < 130 || e.y > height - 20) e.vy *= -1;
  }

  // Define o nível do campo com base na energia final
  function calcularEvolucaoCampo() {
    nivelCampo = min(floor(energia / 4), campoNiveis.length - 1);
  }

  // Prepara o jogo do zero
  function reiniciarJogo() {
    energia = 0;
    tempoRestante = 30;
    cidadeClicados = 0;
    estado = "jogando";
    elementos = [];

    // Cria 20 emojis da cidade e 20 do campo
    for (let i = 0; i < 20; i++) {
      elementos.push(criarElemento(random(cidadeEmojis), "cidade"));
      elementos.push(criarElemento(random(campoEmojis), "campo"));
    }

    tempoUltimaAtualizacao = millis(); // Marca a hora da última troca
  }
