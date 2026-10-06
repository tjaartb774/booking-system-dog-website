/* Beyond the Leash - Groom Finder quiz */
(function () {
  'use strict';
  const D = window.BTL;
  const root = document.getElementById('quiz');
  if (!root) return;
  const Q = D.quiz;
  let step = 0;
  const answers = [];

  function render() {
    if (step < Q.length) renderQuestion(); else renderResult();
  }

  function progress() {
    return '<div class="quiz-progress" aria-hidden="true">' +
      Q.map((_, i) => '<span class="' + (i < step ? 'done' : '') + '"></span>').join('') + '</div>';
  }

  function renderQuestion() {
    const q = Q[step];
    root.innerHTML = progress() +
      '<div class="fade-in">' +
      '<p class="step-label">Question ' + (step + 1) + ' of ' + Q.length + '</p>' +
      '<h3>' + q.question + '</h3>' +
      '<div class="option-grid">' +
      q.options.map((o, i) =>
        '<button type="button" class="option" data-i="' + i + '" aria-pressed="' + (answers[step] === i) + '">' +
        '<span class="emoji" aria-hidden="true">' + o.emoji + '</span><b>' + o.label + '</b></button>').join('') +
      '</div>' +
      '<div class="quiz-nav">' +
      (step > 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-back>← Back</button>' : '<span></span>') +
      '</div></div>';
    root.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => {
      answers[step] = Number(b.dataset.i);
      b.setAttribute('aria-pressed', 'true');
      setTimeout(() => { step++; render(); }, 180);
    }));
    const back = root.querySelector('[data-back]');
    if (back) back.addEventListener('click', () => { step--; render(); });
  }

  function winner() {
    const score = {};
    Q.forEach((q, i) => {
      const o = q.options[answers[i]];
      if (!o) return;
      Object.keys(o.scores).forEach(id => { score[id] = (score[id] || 0) + o.scores[id]; });
    });
    let best = 'full-groom', bestScore = -1;
    D.services.forEach(s => {
      const v = score[s.id] || 0;
      if (v > bestScore) { best = s.id; bestScore = v; }
    });
    return D.services.find(s => s.id === best);
  }

  function renderResult() {
    const s = winner();
    const icon = D.icons[s.icon] || D.icons.paw;
    root.innerHTML = progress() +
      '<div class="quiz-result fade-in">' +
      '<p class="step-label">Our suggestion</p>' +
      '<div class="badge" aria-hidden="true">🐶✨</div>' +
      '<h3>' + s.name + '</h3>' +
      '<p>' + s.blurb + '</p>' +
      '<p class="tip">💡 ' + (D.quizTips[s.id] || '') + '</p>' +
      '<p style="color:var(--muted);font-size:.9rem">This is a starting point. We confirm the right groom and a quote once we meet your dog.</p>' +
      '<div class="quiz-actions">' +
      '<a class="btn btn-primary" href="#book" data-book-service="' + s.id + '">Book this</a>' +
      '<button type="button" class="btn btn-ghost" data-restart>Start over</button>' +
      '</div></div>';
    root.querySelector('[data-restart]').addEventListener('click', () => { step = 0; answers.length = 0; render(); });
    const r = root.getBoundingClientRect();
    if (D.confetti) D.confetti(r.left + r.width / 2, r.top + 80, 18);
  }

  render();
})();
