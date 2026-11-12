document.documentElement.classList.add('js');
['.status-card', '.feedback-card', '.servicos-item', '.como-lista li'].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => el.style.setProperty('--i', i));
});

const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ================= REVELAR SEÇÕES AO ROLAR =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show-section');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.sobre, .servicos, .status, .como, .portfolio, .feedbacks, .instagram, .cta-container, footer'
).forEach((secao) => observer.observe(secao));


// ================= HEADER COM EFEITO AO ROLAR =================
const header = document.querySelector('header');
function atualizarHeader() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const barra = document.querySelector('.progresso');
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (barra) barra.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
}
window.addEventListener('scroll', atualizarHeader, { passive: true });
atualizarHeader();


// ================= MENU HAMBÚRGUER =================
const menuBtn = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

function alternarMenu(abrir) {
  const aberto = menu.classList.toggle('aberto', abrir);
  document.body.classList.toggle('menu-aberto', aberto);
  menuBtn.setAttribute('aria-expanded', aberto);
  menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  menuBtn.querySelector('i').className = aberto ? 'ri-close-line' : 'ri-menu-line';
}

menuBtn.addEventListener('click', () => alternarMenu());
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => alternarMenu(false)));
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) alternarMenu(false);
});


// ================= TROCA DE PALAVRAS (BANNER) =================
function iniciarCarrosselDePalavras() {
  const palavras = document.querySelectorAll('.word-rotator .word');
  if (palavras.length === 0) return;

  let indexAtual = 0;

  setInterval(() => {
    const palavraAtual = palavras[indexAtual];
    palavraAtual.classList.remove('active');
    palavraAtual.classList.add('exit');

    indexAtual = (indexAtual + 1) % palavras.length;
    const proximaPalavra = palavras[indexAtual];
    proximaPalavra.classList.remove('exit');
    proximaPalavra.classList.add('active');

    setTimeout(() => palavraAtual.classList.remove('exit'), 600);
  }, 2500);
}


// ================= ACCORDION DE SERVIÇOS =================
function iniciarAccordionServicos() {
  const itens = document.querySelectorAll('.servicos-item');

  itens.forEach((item) => {
    const botao = item.querySelector('.servicos-header');

    botao.addEventListener('click', () => {
      const estavaAtivo = item.classList.contains('active');

      itens.forEach((outro) => {
        outro.classList.remove('active');
        outro.querySelector('.servicos-header').setAttribute('aria-expanded', 'false');
      });

      if (!estavaAtivo) {
        item.classList.add('active');
        botao.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


// ================= CONTADOR (RODA UMA VEZ) =================
function iniciarContadores() {
  document.querySelectorAll('.status-card h3.numero').forEach((num) => {
    const partes = num.innerText.trim().match(/^(\D*)(\d+)(\D*)$/);
    if (!partes) return;

    const [, prefixo, valor, sufixo] = partes;
    const final = parseInt(valor, 10);

    if (reduzMovimento) {
      num.innerText = prefixo + final + sufixo;
      return;
    }

    const duracao = 2000;
    const inicio = performance.now();

    const tick = (agora) => {
      const p = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - p, 3); // ease-out
      num.innerText = prefixo + Math.round(final * suave) + sufixo;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}


// ================= PORTFÓLIO =================
const portfolio = [
  { img: 'img/florência.png', titulo: 'Florência Bassanelli' },
  { img: 'img/Althas.png', titulo: 'Althas Treinamentos' },
  { img: 'img/Ambar.png', titulo: 'Ambar' }
];

let atual = 0;

// Pré-carrega as imagens para a troca não piscar
portfolio.forEach((p) => { const i = new Image(); i.src = p.img; });

const imagemPortfolio = document.getElementById('portfolio-img');
const tituloPortfolio = document.getElementById('portfolio-title');
const cardPortfolio = document.querySelector('.portfolio-content');

function trocar(indice, direcao) {
  cardPortfolio.classList.remove('animar-proximo', 'animar-anterior');
  void cardPortfolio.offsetWidth; // reinicia a animação

  imagemPortfolio.src = portfolio[indice].img;
  tituloPortfolio.textContent = portfolio[indice].titulo;

  cardPortfolio.classList.add(direcao === 'proximo' ? 'animar-proximo' : 'animar-anterior');
}

function proximoPortfolio() {
  atual = (atual + 1) % portfolio.length;
  trocar(atual, 'proximo');
}

function anteriorPortfolio() {
  atual = (atual - 1 + portfolio.length) % portfolio.length;
  trocar(atual, 'anterior');
}

// Swipe no celular
const sliderPortfolio = document.querySelector('.portfolio-slider');
let toqueInicial = null;

sliderPortfolio.addEventListener('touchstart', (e) => {
  toqueInicial = e.touches[0].clientX;
}, { passive: true });

sliderPortfolio.addEventListener('touchend', (e) => {
  if (toqueInicial === null) return;
  const diferenca = e.changedTouches[0].clientX - toqueInicial;
  if (Math.abs(diferenca) > 50) {
    diferenca < 0 ? proximoPortfolio() : anteriorPortfolio();
  }
  toqueInicial = null;
});


// ================= MODAL DE IMAGEM =================
function abrirImagem(src) {
  document.getElementById('imagemAmpliada').src = src;
  document.getElementById('imagemModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharImagem() {
  document.getElementById('imagemModal').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('imagemModal').addEventListener('click', function (event) {
  if (event.target === this) fecharImagem();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    fecharImagem();
    alternarMenu(false);
  }
});


// ================= BOTÕES (sem onclick no HTML) =================
document.querySelector('.portfolio-arrow.left').addEventListener('click', anteriorPortfolio);
document.querySelector('.portfolio-arrow.right').addEventListener('click', proximoPortfolio);
imagemPortfolio.addEventListener('click', () => abrirImagem(imagemPortfolio.src));
document.querySelector('.fechar-modal').addEventListener('click', fecharImagem);


// ================= INICIALIZAÇÃO =================
document.addEventListener('DOMContentLoaded', () => {
  iniciarCarrosselDePalavras();
  iniciarAccordionServicos();

  const status = document.querySelector('.status');
  if (status) {
    const statusObserver = new IntersectionObserver((entries, obs) => {
      if (entries.some((e) => e.isIntersecting)) {
        iniciarContadores();
        obs.disconnect();
      }
    }, { threshold: 0.3 });

    statusObserver.observe(status);
  }
});