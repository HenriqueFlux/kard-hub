export const runtime = 'edge'

export const metadata = { title: 'Calculadora de Comprometimento — Kard Hub' }

export default function CalculadoraPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Calculadora de Comprometimento</h2>
        <p className="mt-1 text-sm text-gray-500">
          Limite de comprometimento: 70% da renda bruta
        </p>
      </div>
      <CalculadoraEmbed />
    </div>
  )
}

function CalculadoraEmbed() {
  return (
    <>
      <style>{`
        .calc-card { background: #fff; border-radius: 20px; width: 100%; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 24px rgba(25,37,71,0.08); }
        .calc-header { background: #192547; padding: 28px 32px 24px; position: relative; overflow: hidden; }
        .calc-header::after { content: ''; position: absolute; right: -30px; top: -30px; width: 130px; height: 130px; background: #01F767; border-radius: 50%; opacity: 0.15; }
        .calc-header h1 { font-size: 17px; font-weight: 700; color: #fff; line-height: 1.35; }
        .calc-header p { margin-top: 6px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); }
        .calc-body { padding: 28px 32px 32px; }
        .calc-field { margin-bottom: 18px; }
        .calc-label { display: block; font-size: 11px; font-weight: 700; color: #192547; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 7px; font-family: inherit; }
        .calc-input-wrap { position: relative; }
        .calc-prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 700; color: #64748b; pointer-events: none; font-family: inherit; }
        .calc-input { width: 100%; padding: 12px 14px 12px 38px; border: 2px solid #e2e8f0; border-radius: 10px; font-family: inherit; font-size: 15px; font-weight: 600; color: #192547; background: #f4f6fb; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; outline: none; }
        .calc-input:focus { border-color: #01F767; background: #fff; box-shadow: 0 0 0 3px rgba(1,247,103,0.15); }
        .calc-input::placeholder { color: #b0bec5; font-weight: 500; }
        .calc-divider { height: 1px; background: #e2e8f0; margin: 22px 0; }
        .calc-btn { width: 100%; padding: 14px; background: #192547; color: #fff; border: none; border-radius: 12px; font-family: inherit; font-size: 14px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; transition: background 0.18s, transform 0.12s, box-shadow 0.18s; }
        .calc-btn:hover { background: #1e3063; box-shadow: 0 6px 20px rgba(25,37,71,0.22); transform: translateY(-1px); }
        .calc-btn:active { transform: translateY(0); box-shadow: none; }
        .calc-result { margin-top: 18px; border-radius: 14px; overflow: hidden; display: none; animation: calcFadeIn 0.3s ease; }
        @keyframes calcFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .calc-result.show { display: block; }
        .calc-result-inner { padding: 18px 20px; display: flex; align-items: center; gap: 14px; }
        .calc-result-icon { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; flex-shrink: 0; }
        .calc-result-pct { font-size: 26px; font-weight: 900; letter-spacing: -1px; line-height: 1; }
        .calc-result-lbl { font-size: 12px; font-weight: 700; margin-top: 4px; }
        .calc-ok { background: #f0fdf4; border: 2px solid #bbf7d0; }
        .calc-ok .calc-result-icon { background: #dcfce7; color: #16a34a; }
        .calc-ok .calc-result-pct { color: #16a34a; }
        .calc-ok .calc-result-lbl { color: #15803d; }
        .calc-danger { background: #fef2f2; border: 2px solid #fecaca; }
        .calc-danger .calc-result-icon { background: #fee2e2; color: #ef4444; }
        .calc-danger .calc-result-pct { color: #ef4444; }
        .calc-danger .calc-result-lbl { color: #b91c1c; }
        .calc-warn { background: #fffbeb; border: 2px solid #fde68a; }
        .calc-warn .calc-result-icon { background: #fef3c7; color: #f59e0b; }
        .calc-warn .calc-result-pct { color: #f59e0b; }
        .calc-warn .calc-result-lbl { color: #b45309; }
        .calc-error { margin-top: 12px; padding: 10px 14px; background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 8px; font-size: 12px; font-weight: 600; color: #c2410c; display: none; }
        .calc-error.show { display: block; }
      `}</style>

      <div className="calc-card">
        <div className="calc-header">
          <h1>Calculadora de Comprometimento de Renda</h1>
          <p>Limite de comprometimento: 70% da renda bruta</p>
        </div>
        <div className="calc-body">
          <div className="calc-field">
            <label className="calc-label" htmlFor="calc-salario">Salário Fixo</label>
            <div className="calc-input-wrap">
              <span className="calc-prefix">R$</span>
              <input type="text" id="calc-salario" className="calc-input" placeholder="0,00" inputMode="decimal" autoComplete="off" />
            </div>
          </div>
          <div className="calc-field">
            <label className="calc-label" htmlFor="calc-descontos">Total de Descontos Existentes</label>
            <div className="calc-input-wrap">
              <span className="calc-prefix">R$</span>
              <input type="text" id="calc-descontos" className="calc-input" placeholder="0,00" inputMode="decimal" autoComplete="off" />
            </div>
          </div>
          <div className="calc-field">
            <label className="calc-label" htmlFor="calc-parcela">Parcela Contratada (nova)</label>
            <div className="calc-input-wrap">
              <span className="calc-prefix">R$</span>
              <input type="text" id="calc-parcela" className="calc-input" placeholder="0,00" inputMode="decimal" autoComplete="off" />
            </div>
          </div>
          <div className="calc-divider" />
          <button className="calc-btn" id="calc-btn">Calcular Comprometimento</button>
          <div className="calc-error" id="calc-error">Preencha o Salário Fixo com um valor maior que zero.</div>
          <div className="calc-result" id="calc-result">
            <div className="calc-result-inner">
              <div className="calc-result-icon" id="calc-icon"></div>
              <div>
                <div className="calc-result-pct" id="calc-pct"></div>
                <div className="calc-result-lbl" id="calc-lbl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        function calcMask(input) {
          var v = input.value.replace(/\\D/g, '');
          if (!v) { input.value = ''; return; }
          v = (parseInt(v, 10) / 100).toFixed(2);
          input.value = v.replace('.', ',').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
        }
        function calcParse(s) {
          if (!s || !s.trim()) return 0;
          return parseFloat(s.replace(/\\./g, '').replace(',', '.')) || 0;
        }
        ['calc-salario','calc-descontos','calc-parcela'].forEach(function(id) {
          var el = document.getElementById(id);
          if (!el) return;
          el.addEventListener('input', function() { calcMask(el); });
          el.addEventListener('keydown', function(e) { if (e.key === 'Enter') calcular(); });
        });
        document.getElementById('calc-btn').addEventListener('click', calcular);
        function calcular() {
          var salario   = calcParse(document.getElementById('calc-salario').value);
          var descontos = calcParse(document.getElementById('calc-descontos').value);
          var parcela   = calcParse(document.getElementById('calc-parcela').value);
          var errEl = document.getElementById('calc-error');
          var resEl = document.getElementById('calc-result');
          errEl.classList.remove('show');
          resEl.classList.remove('show','calc-ok','calc-danger','calc-warn');
          if (salario <= 0) { errEl.classList.add('show'); return; }
          var comp = (descontos + parcela) / salario;
          var pct  = (comp * 100).toFixed(2).replace('.', ',');
          document.getElementById('calc-pct').textContent = pct + '%';
          var icon = document.getElementById('calc-icon');
          var lbl  = document.getElementById('calc-lbl');
          if (comp >= 0 && comp < 0.6999) {
            resEl.classList.add('show','calc-ok');
            icon.textContent = '✓'; lbl.textContent = 'Dentro dos parâmetros para avaliação';
          } else if (comp >= 0.6999 && comp <= 1) {
            resEl.classList.add('show','calc-danger');
            icon.textContent = '✕'; lbl.textContent = 'Fora dos parâmetros';
          } else {
            resEl.classList.add('show','calc-danger');
            icon.textContent = '✕'; lbl.textContent = 'Fora dos parâmetros — comprometimento acima de 100%';
          }
        }
      `}} />
    </>
  )
}
