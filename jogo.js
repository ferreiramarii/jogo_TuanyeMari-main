// Seleciona o elemento canvas da página
var canvas = document.querySelector('canvas');

// Define o tamanho do canvas igual ao tamanho da janela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Obtém o contexto 2D para desenhar no canvas
var c = canvas.getContext('2d');

// Velocidade de movimentação do jogador
var velocidade = 3;

// Posição inicial do jogador
var x = 60;
var y = 80;

// Variável para controlar o tremor do círculo branco
var tremerXC = 0.1;
var xc = 676

// Objeto que armazenará as teclas pressionadas
var teclas = {};

// Quantidade de pontos coletados
var coletados = 0;

// Quando uma tecla é pressionada
document.addEventListener("keydown", (event) => {
    teclas[event.key] = true;
});

// Quando uma tecla é solta
document.addEventListener("keyup", (event) => {
    teclas[event.key] = false;
});

// Array que armazenará os pontos coletáveis
var pontos = [];

// Cria 25 pontos em posições aleatórias
for (var i = 0; i < 25; i++) {
    pontos.push({
        w: random(0, canvas.width - 16),   // posição X aleatória
        z: random(0, canvas.height - 16)   // posição Y aleatória
    });
}

// Função principal da animação
function animate(){

    // Chama a função novamente a cada frame
    requestAnimationFrame(animate);

    // Define a cor de fundo
    c.fillStyle = '#000000';

    // Desenha o fundo preto ocupando toda a tela
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Define a cor do texto
    c.fillStyle = "#ffffff";

    // Define a fonte
    c.font = "30px Arial";

    // Desenha o contador
    c.fillText(coletados + "/25", canvas.width - 100, 40);
    
    // Desenha um círculo branco que vai simular estar tremendo na tela
    c.beginPath();
    c.arc(xc, 322, 35, 0, Math.PI * 2, false);
    c.fillStyle = "#ffffff";
    c.fill();

    // Verifica se o círculo branco atingiu os limites para inverter a direção do tremor
    //Anda 2 para direita, inverte e anda 2 para esquerda, inverte
    if(xc + tremerXC > 690){ 
        tremerXC = -tremerXC
    }

    if(xc + tremerXC < 670){
        tremerXC = -tremerXC
    }

    xc += tremerXC; // Atualiza a posição do círculo branco para criar o efeito de tremor
    
    // Limpa apenas a área do jogador
    c.clearRect(x, y, 35, 35);

    // Define a cor do jogador
    c.fillStyle = "#d805fe";

    // Movimentação usando as setas do teclado
    if (teclas["ArrowUp"])
        y -= velocidade;

    if (teclas["ArrowDown"])
        y += velocidade;

    if (teclas["ArrowLeft"])
        x -= velocidade;

    if (teclas["ArrowRight"])
        x += velocidade;

    // Verifica colisão entre jogador e círculo central
    if (x + 35 > xc - 35 && x < xc + 35 && y + 35 > 322 - 35 && y < 322 + 35  ){
        // Redesenha os pontinhos e redefine as variaáveis com seus valores iniciais 
        x = 60;
        y = 80;
        coletados = 0;
        pontos = [];
        for (var i = 0; i < 25; i++) {
            pontos.push({
                w: random(0, canvas.width - 16),
                z: random(0, canvas.height - 16)
            });
        }
    }

    // Desenha o jogador (quadrado rosa)
    c.fillRect(x, y, 35, 35);

    // Se sair pela direita da tela, volta para o início
    if ((x + 35) > canvas.width) {
        x = 60;
        y = 80;
    }

    // Se sair pela parte inferior da tela, volta para o início
    if ((y + 35) > canvas.height) {
        x = 60;
        y = 80;
    }

    // Se sair pela parte superior da tela, volta para o início
    if ((y + 35) < 0) {
        x = 60;
        y = 80;
    }

    // Se sair pela esquerda da tela, volta para o início
    if ((x + 35) < 0) {
        x = 60;
        y = 80;
    }

    // Percorre todos os pontos do último para o primeiro
    for (var i = pontos.length - 1; i >= 0; i--) {

        // Saber onde o núcleo está para os pontos se moverem em direção a ele
        var dx = xc - pontos[i].w;
        var dy = 322 - pontos[i].z;

        // atração e repulsão dos pontos em relação ao núcleo
        if (tremerXC > 0) {

            // Atrai os pontos para o núcleo
            pontos[i].w += dx * 0.001;
            pontos[i].z += dy * 0.001;
        }

        if (tremerXC < 0) {

            // Repele os pontos para longe do núcleo
            pontos[i].w -= dx * 0.001;
            pontos[i].z -= dy * 0.001;
        }

        // Desenha o ponto
        c.beginPath();
        c.arc(pontos[i].w, pontos[i].z, 8, 0, Math.PI * 2, false);
        c.fillStyle = "#ffff2f";
        c.fill();

        // Verifica colisão entre o jogador e o ponto
        if (pontos[i].w + 8 > x && pontos[i].w - 8 < x + 35 && pontos[i].z + 8 > y && pontos[i].z - 8 < y + 35){
            // Remove o ponto coletado
            pontos.splice(i, 1);
            coletados++;
        }
    }
    // Verifica se o jogador já coletou todos os 25 pontos
    if (coletados == 25) {

        // Garante que não existem mais pontos no vetor
        if (pontos.length === 0) {

            // Define a cor do texto como branca
            c.fillStyle = "#ffffff";

            // Define o tamanho e a fonte do texto
            c.font = "80px Arial";

            // Texto que será exibido na tela
            var texto = "FIM DE JOGO";

            // Calcula a largura do texto para centralizá-lo
            var larguraTexto = c.measureText(texto).width;

            // Desenha o texto centralizado horizontalmente
            // e aproximadamente no meio da tela verticalmente
            c.fillText(
                texto,
                (canvas.width - larguraTexto) / 2,
                canvas.height / 2
            );
        }
    }
}

// Função para gerar números aleatórios
function random(min, max){
    return Math.random() * (max - min) + min;
}

// Inicia a animação
animate();