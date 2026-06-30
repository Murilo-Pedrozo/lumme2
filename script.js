// ================= ANIMAÇÃO DE SURGIMENTO DAS SEÇÕES (SCROLL) =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show-section');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

const animarSecoes = document.querySelectorAll(
  '.banner, .sobre, .servicos, .status, .portfolio, .feedbacks, .cta-container, footer'
);

animarSecoes.forEach((secao) => {
  observer.observe(secao);
});


// ================= SISTEMA DE TROCA DE PALAVRAS (LOOP BANNER) =================
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

    setTimeout(() => {
      palavraAtual.classList.remove('exit');
    }, 600);

  }, 2500);
}


// ================= ACCORDION DE SERVIÇOS =================
function iniciarAccordionServicos() {
  const itensServicos = document.querySelectorAll('.servicos-item');

  itensServicos.forEach((item) => {
    item.addEventListener('click', () => {
      const estaAtivo = item.classList.contains('active');

      itensServicos.forEach((outroItem) => {
        outroItem.classList.remove('active');
      });

      if (!estaAtivo) {
        item.classList.add('active');
      }
    });
  });
}


// ================= CONTADOR ANIMADO COM PULSO E LOOP (STATUS) =================
function iniciarContadores() {
  const numeros = document.querySelectorAll('.status-card h3.numero');

  numeros.forEach((num) => {
    const card = num.closest('.status-card');

    if (!num.dataset.valorOriginal) {
      num.dataset.valorOriginal = num.innerText;
    }

    const textoOriginal = num.dataset.valorOriginal;
    const valorFinal = parseInt(textoOriginal.replace(/[^0-9]/g, ''));
    const sufixo = textoOriginal.replace(/[0-9]/g, '');

    const duracao = 2500;
    const tempoDestaque = 4500;
    const pausaZerar = 200;
    const incremento = valorFinal / (duracao / 16);

    const rodarContador = () => {
      let valorAtual = 0;

      const atualizarNumero = () => {
        valorAtual += incremento;

        if (valorAtual >= valorFinal) {
          num.innerText = valorFinal + sufixo;

          num.classList.add('pulsar');
          if (card) card.classList.add('piscar-fundo');

          setTimeout(() => {
            num.classList.remove('pulsar');
            if (card) card.classList.remove('piscar-fundo');

            num.innerText = "0" + sufixo;

            setTimeout(rodarContador, pausaZerar);

          }, tempoDestaque);

        } else {
          num.innerText = Math.floor(valorAtual) + sufixo;
          requestAnimationFrame(atualizarNumero);
        }
      };

      atualizarNumero();
    };

    rodarContador();
  });
}

iniciarContadores();

// ================= INICIALIZADOR GLOBAL (DOM CONTENT LOADED) =================
document.addEventListener('DOMContentLoaded', () => {
  iniciarCarrosselDePalavras();
  iniciarAccordionServicos();

  const statusSection = document.querySelector('.status');
  if (statusSection) {
    const statusObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          iniciarContadores();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statusObserver.observe(statusSection);
  }
});

const portfolio = [
  { img: "img/portfolio-item1.jpeg", titulo: "IDENTIDADE VISUAL" },
  { img: "img/portfolio-item2.jpeg", titulo: "BRANDING" },
  { img: "img/portfolio-item3.jpeg", titulo: "SOCIAL MEDIA" }
];

let atual = 0;

const imagem = document.getElementById("portfolio-img");
const titulo = document.getElementById("portfolio-title");
const card = document.querySelector(".portfolio-content");

function trocar(indice, direcao) {
  card.classList.remove("animar-proximo", "animar-anterior");

  void card.offsetWidth;

  imagem.src = portfolio[indice].img;
  titulo.textContent = portfolio[indice].titulo;

  if (direcao === "proximo") {
    card.classList.add("animar-proximo");
  } else {
    card.classList.add("animar-anterior");
  }
}

document.querySelector(".right").addEventListener("click", () => {
  atual++;
  if (atual >= portfolio.length) {
    atual = 0;
  }
  trocar(atual, "proximo");
});

document.querySelector(".left").addEventListener("click", () => {
  atual--;
  if (atual < 0) {
    atual = portfolio.length - 1;
  }
  trocar(atual, "anterior");
});