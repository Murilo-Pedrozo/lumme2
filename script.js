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


function iniciarAccordionServicos() {
  // Seleciona todas as linhas de serviço
  const itensServicos = document.querySelectorAll('.servicos-item');

  itensServicos.forEach((item) => {
    item.addEventListener('click', () => {
      // Verifica se o item clicado já está aberto
      const estaAtivo = item.classList.contains('active');

      // FECHA TODOS OS ITENS: Garante o efeito "sanfona" (só um aberto por vez)
      itensServicos.forEach((outroItem) => {
        outroItem.classList.remove('active');
      });

      // SE NÃO ESTAVA ABERTO: Abre o item que acabou de ser clicado
      if (!estaAtivo) {
        item.classList.add('active');
      }
    });
  });
}

// ================= INICIALIZADOR GLOBAL =================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof iniciarCarrosselDePalavras === 'function') {
    iniciarCarrosselDePalavras();
  }

  iniciarAccordionServicos();
});


// ================= CONTADOR ANIMADO (STATUS) =================
function iniciarContadores() {
  const numeros = document.querySelectorAll('.status-card h3.numero');

  numeros.forEach((num) => {
    const valorFinal = parseInt(num.innerText.replace(/[^0-9]/g, ''));
    const sufixo = num.innerText.replace(/[0-9]/g, '');

    let valorAtual = 0;
    const duracao = 1500;
    const incremento = valorFinal / (duracao / 16);

    const atualizarNumero = () => {
      valorAtual += incremento;
      if (valorAtual >= valorFinal) {
        num.innerText = valorFinal + sufixo;
      } else {
        num.innerText = Math.floor(valorAtual) + sufixo;
        requestAnimationFrame(atualizarNumero);
      }
    };

    atualizarNumero();
  });
}

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