// 1. BANCO DE PERGUNTAS (Adicione quantas quiser!)
const allQuestions = [
    {
      question: "Como se diz 'Obrigado' em inglês?",
      options: ["Please", "Thank you", "Sorry", "Welcome"],
      correct: 1,
      rationale: "'Thank you' é a forma padrão de dizer 'Obrigado'."
    },
    {
      question: "Qual o passado do verbo 'To Go'?",
      options: ["Goned", "Went", "Goes", "Going"],
      correct: 1,
      rationale: "'Went' é o passado irregular do verbo 'To Go'."
    },
    {
      question: "Ouça a pronúncia e escolha a tradução correta para 'Schedule':",
      audioText: "Schedule",
      options: ["Escola", "Cronograma / Agenda", "Sombra", "Esquema"],
      correct: 1,
      rationale: "'Schedule' significa agendamento, cronograma ou agenda."
    },
    {
      question: "Qual frase está no Present Continuous?",
      options: ["I run every day", "I am running now", "I ran yesterday", "I will run"],
      correct: 1,
      rationale: "O Present Continuous usa a estrutura: Sujeito + Verb To Be + Verbo com -ing."
    },
    {
      question: "Qual é o oposto de 'Big'?",
      options: ["Large", "Small", "Tall", "Fast"],
      correct: 1,
      rationale: "'Small' (pequeno) é o oposto de 'Big' (grande)."
    },
    {
      question: "Como se diz 'Livro' em inglês?",
      options: ["Pencil", "Door", "Book", "Chair"],
      correct: 2,
      rationale: "'Book' é a tradução de livro."
    },
    {
      question: "Ouça a pronúncia e escolha a palavra falada:",
      audioText: "Beautiful",
      options: ["Butter", "Beautiful", "Bottle", "Brother"],
      correct: 1,
      rationale: "'Beautiful' significa bonito(a) ou lindo(a)."
    },
    {
      question: "Qual é o significado de 'Always'?",
      options: ["Nunca", "Sempre", "Às vezes", "Raramente"],
      correct: 1,
      rationale: "'Always' é um advérbio de frequência que significa 'sempre'."
    },
    {
      question: "Escolha a forma correta: 'She ___ a student.'",
      options: ["are", "am", "is", "be"],
      correct: 2,
      rationale: "Para a terceira pessoa do singular (He/She/It) no presente, usamos 'is'."
    },
    {
      question: "Como se diz 'Café da manhã' em inglês?",
      options: ["Lunch", "Dinner", "Breakfast", "Snack"],
      correct: 2,
      rationale: "'Breakfast' é a refeição matinal (café da manhã)."
    },
    {
      question: "Ouça a palavra e selecione a escrita correta:",
      audioText: "Knowledge",
      options: ["Knowledge", "Noledge", "Knowlege", "Nowledge"],
      correct: 0,
      rationale: "'Knowledge' (conhecimento) começa com a letra 'K' muda."
    },
    {
      question: "Qual o plural de 'Child'?",
      options: ["Childs", "Children", "Childrens", "Childes"],
      correct: 1,
      rationale: "'Children' é o plural irregular de 'Child'."
    }
  ];
  
  // VARIÁVEIS DE ESTADO
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let lives = 3;
  let timer = null;
  let timeLeft = 60;
  let has5050 = true;
  let answered = false;
  
  // 2. FUNÇÃO DE EMBARALHAR (Fisher-Yates)
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // 3. SÍNTESE DE VOZ (ÁUDIO)
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Para áudios anteriores
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }
  
  // Carregar recorde salvo
  document.addEventListener("DOMContentLoaded", () => {
    const highScore = localStorage.getItem("quiz_high_score") || 0;
    const highScoreEl = document.getElementById("high-score");
    if (highScoreEl) highScoreEl.innerText = `${highScore} / 10`;
  });
  
  // 4. INICIAR QUIZ
  function startQuiz() {
    // Sorteia perguntas aleatórias (pega até 10 do banco)
    const shuffled = shuffleArray(allQuestions);
    questions = shuffled.slice(0, 10);
  
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    has5050 = true;
  
    updateLivesDisplay();
    reset5050Button();
  
    document.getElementById("progress-container").classList.remove("hidden");
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
  
    showQuestion();
  }
  
  // 5. EXIBIR PERGUNTA
  function showQuestion() {
    answered = false;
    clearInterval(timer);
    startTimer();
  
    const q = questions[currentQuestionIndex];
    
    // Atualiza barra de progresso
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercent}%`;
  
    document.getElementById("question-number").innerText = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
    document.getElementById("score-count").innerText = `Pontos: ${score}`;
    
    const qText = document.getElementById("question-text");
    
    // Se tiver áudio na pergunta
    if (q.audioText) {
      qText.innerHTML = `
        ${q.question}
        <button onclick="speakText('${q.audioText}')" class="ml-2 px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white text-xs rounded-lg transition-all inline-flex items-center gap-1 font-normal">
          🔊 Ouvir Pronúncia
        </button>
      `;
      speakText(q.audioText);
    } else {
      qText.innerText = q.question;
    }
  
    // Esconde explicação e botão 'Próxima'
    document.getElementById("explanation").classList.add("hidden");
    document.getElementById("next-btn").classList.add("hidden");
  
    // Renderiza as opções
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
  
    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "w-full text-left p-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-100 font-medium transition-all duration-200 transform hover:scale-[1.01] flex justify-between items-center";
      btn.innerHTML = `<span>${opt}</span>`;
      btn.onclick = () => selectOption(index);
      optionsContainer.appendChild(btn);
    });
  }
  
  // 6. TIMER (60s)
  function startTimer() {
    timeLeft = 60;
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.innerText = `⏱️ 01:00`;
    timerDisplay.className = "px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-bold";
  
    timer = setInterval(() => {
      timeLeft--;
      const secs = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
      timerDisplay.innerText = `⏱️ 00:${secs}`;
  
      if (timeLeft <= 10) {
        timerDisplay.className = "px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full font-bold animate-pulse";
      }
  
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimeout();
      }
    }, 1000);
  }
  
  function handleTimeout() {
    if (answered) return;
    answered = true;
    lives--;
    updateLivesDisplay();
  
    const q = questions[currentQuestionIndex];
    highlightAnswers(q.correct, -1);
    showExplanation("O tempo acabou! Tente responder mais rápido na próxima.");
  
    if (lives <= 0) {
      setTimeout(endQuiz, 2000);
    } else {
      document.getElementById("next-btn").classList.remove("hidden");
    }
  }
  
  // 7. SELEÇÃO DE RESPOSTA
  function selectOption(selectedIndex) {
    if (answered) return;
    answered = true;
    clearInterval(timer);
  
    const q = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;
  
    if (isCorrect) {
      score++;
      document.getElementById("score-count").innerText = `Pontos: ${score}`;
    } else {
      lives--;
      updateLivesDisplay();
    }
  
    highlightAnswers(q.correct, selectedIndex);
    showExplanation(q.rationale);
  
    if (lives <= 0) {
      setTimeout(endQuiz, 2000);
    } else {
      document.getElementById("next-btn").classList.remove("hidden");
    }
  }
  
  function highlightAnswers(correctIndex, selectedIndex) {
    const container = document.getElementById("options-container");
    const buttons = container.querySelectorAll("button");
  
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) {
        btn.className = "w-full text-left p-4 rounded-xl bg-emerald-600 border border-emerald-400 text-white font-bold flex justify-between items-center shadow-lg";
        btn.innerHTML += `<span>✓</span>`;
      } else if (idx === selectedIndex) {
        btn.className = "w-full text-left p-4 rounded-xl bg-rose-900/80 border border-rose-500 text-rose-200 font-medium flex justify-between items-center";
        btn.innerHTML += `<span>✗</span>`;
      } else {
        btn.className = "w-full text-left p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-500 opacity-50";
      }
    });
  }
  
  function showExplanation(text) {
    const expDiv = document.getElementById("explanation");
    document.getElementById("explanation-text").innerText = text;
    expDiv.classList.remove("hidden");
  }
  
  // 8. AJUDA 50:50
  function use5050() {
    if (!has5050 || answered) return;
  
    has5050 = false;
    const btn = document.getElementById("help-5050-btn");
    btn.disabled = true;
    btn.classList.add("opacity-40", "cursor-not-allowed");
    document.getElementById("help-badge").innerText = "0";
  
    const q = questions[currentQuestionIndex];
    const container = document.getElementById("options-container");
    const buttons = Array.from(container.querySelectorAll("button"));
  
    let incorrectIndices = [];
    q.options.forEach((_, idx) => {
      if (idx !== q.correct) incorrectIndices.push(idx);
    });
  
    // Embaralha incorretas e esconde duas
    incorrectIndices = shuffleArray(incorrectIndices).slice(0, 2);
  
    incorrectIndices.forEach(idx => {
      buttons[idx].style.visibility = "hidden";
    });
  }
  
  function reset5050Button() {
    const btn = document.getElementById("help-5050-btn");
    btn.disabled = false;
    btn.classList.remove("opacity-40", "cursor-not-allowed");
    document.getElementById("help-badge").innerText = "1";
  }
  
  // 9. ATUALIZAÇÃO DE VIDAS
  function updateLivesDisplay() {
    for (let i = 1; i <= 3; i++) {
      const heart = document.getElementById(`heart-${i}`);
      if (i <= lives) {
        heart.innerText = "❤️";
        heart.classList.remove("opacity-20", "grayscale");
      } else {
        heart.innerText = "🖤";
        heart.classList.add("opacity-20", "grayscale");
      }
    }
  }
  
  // 10. AVANÇAR PERGUNTA
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length && lives > 0) {
      showQuestion();
    } else {
      endQuiz();
    }
  }
  
  // 11. FIM DO JOGO / RESULTADO
  function endQuiz() {
    clearInterval(timer);
  
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("progress-container").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
  
    // Salvar recorde
    const currentRecord = parseInt(localStorage.getItem("quiz_high_score") || "0");
    if (score > currentRecord) {
      localStorage.setItem("quiz_high_score", score);
      const highScoreEl = document.getElementById("high-score");
      if (highScoreEl) highScoreEl.innerText = `${score} / 10`;
    }
  
    document.getElementById("final-score").innerText = `${score} / ${questions.length}`;
  
    const iconEl = document.getElementById("result-icon");
    const titleEl = document.getElementById("result-title");
    const msgEl = document.getElementById("result-message");
    const tipsEl = document.getElementById("study-tips");
  
    tipsEl.innerHTML = "";
  
    if (score >= 8) {
      iconEl.className = "inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 text-4xl";
      iconEl.innerText = "🏆";
      titleEl.innerText = "Excelente!";
      msgEl.innerText = "Seu domínio do vocabulário e gramática básica está incrível!";
      
      tipsEl.innerHTML = `
        <li>Continue praticando para fixar o vocabulário avançado.</li>
        <li>Experimente assistir a séries e vídeos em inglês com legendas em inglês.</li>
      `;
  
      // Confetes se atingir pontuação alta
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else if (score >= 5) {
      iconEl.className = "inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 text-4xl";
      iconEl.innerText = "🎯";
      titleEl.innerText = "Bom trabalho!";
      msgEl.innerText = "Você tem uma boa base, mas ainda pode evoluir mais.";
      
      tipsEl.innerHTML = `
        <li>Revise os pontos em que ficou em dúvida durante o jogo.</li>
        <li>Pratique a pronúncia das palavras utilizando o botão de som.</li>
      `;
    } else {
      iconEl.className = "inline-flex p-4 rounded-full bg-rose-500/20 text-rose-400 text-4xl";
      iconEl.innerText = "📚";
      titleEl.innerText = "Continue praticando!";
      msgEl.innerText = "Não desanime, o aprendizado de um novo idioma vem com a prática constante.";
      
      tipsEl.innerHTML = `
        <li>Tente jogar novamente para se familiarizar com as perguntas.</li>
        <li>Anote as palavras novas e leia as explicações ao final de cada questão.</li>
      `;
    }
  }
  
  // 12. REINICIAR
  function restartQuiz() {
    startQuiz();
  }