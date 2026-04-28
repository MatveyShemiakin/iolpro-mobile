import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Download, Eye, FileJson, Info, RotateCcw, ShieldAlert, Smartphone } from 'lucide-react';
import { calculateReport, exportReportJson } from './core/report';
import type { BiometryInput, CalculationReport, CalculationMode, EyeSide } from './core/types';
import { lensCatalog } from './data/lensCatalog';

const defaultInput: BiometryInput = {
  patientId: '',
  eye: 'OD',
  mode: 'standard',
  axialLength: 23.55,
  k1: 43.25,
  k1Axis: 10,
  k2: 44.1,
  k2Axis: 100,
  anteriorChamberDepth: 3.1,
  lensThickness: 4.4,
  whiteToWhite: 11.8,
  centralCornealThickness: 540,
  targetRefraction: -0.25,
  aConstant: 119.2,
  incisionAxis: 120,
  surgicallyInducedAstigmatism: 0.1,
  posteriorCorneaMode: 'nomogram',
  notes: ''
};

const modeLabels: Record<CalculationMode, string> = {
  standard: 'Standard',
  toric: 'Toric',
  postRefractive: 'Post-refractive'
};

function NumberField({
  label,
  value,
  onChange,
  step = 0.01,
  suffix,
  helper
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  step?: number;
  suffix?: string;
  helper?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="field-input-row">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value ?? ''}
          onChange={(event) => {
            const next = event.currentTarget.value;
            onChange(next === '' ? undefined : Number(next));
          }}
        />
        {suffix ? <b>{suffix}</b> : null}
      </div>
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

function downloadText(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [input, setInput] = useState<BiometryInput>(defaultInput);
  const [selectedLensId, setSelectedLensId] = useState(lensCatalog[0].id);
  const [report, setReport] = useState<CalculationReport | null>(null);
  const lens = useMemo(() => lensCatalog.find((item) => item.id === selectedLensId), [selectedLensId]);

  function patch<K extends keyof BiometryInput>(key: K, value: BiometryInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function runCalculation() {
    const next = await calculateReport({ ...input, aConstant: lens?.aConstant ?? input.aConstant }, lens);
    setReport(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const highestSeverity = report?.issues.find((issue) => issue.severity === 'error') ? 'error' : report?.issues.find((issue) => issue.severity === 'warning') ? 'warning' : 'ok';

  return (
    <main>
      <header className="hero">
        <div>
          <div className="eyebrow"><Smartphone size={16} /> Mobile-first PWA</div>
          <h1>IOLPro Mobile</h1>
          <p>Прототип профессионального планирования ИОЛ: ввод биометрии, контроль качества, сравнение модулей формул, toric workflow и экспорт аудита.</p>
        </div>
        <div className="hero-card">
          <ShieldAlert size={22} />
          <b>Не сертифицировано как медицинское изделие</b>
          <span>Современные формулы Barrett/Kane/EVO/PEARL/Hill-RBF подключены как лицензируемые коннекторы. Локально включён только legacy reference-модуль для проверки интерфейса.</span>
        </div>
      </header>

      <section className="toolbar sticky">
        <button className="primary" onClick={runCalculation}><Activity size={18} /> Рассчитать</button>
        <button onClick={() => { setInput(defaultInput); setReport(null); }}><RotateCcw size={18} /> Сброс</button>
        {report ? (
          <button onClick={() => downloadText(`iolpro-${input.patientId || input.eye}-${Date.now()}.json`, exportReportJson(report))}>
            <FileJson size={18} /> JSON
          </button>
        ) : null}
      </section>

      {report ? (
        <section className={`status ${highestSeverity}`}>
          {highestSeverity === 'ok' ? <CheckCircle2 /> : <AlertTriangle />}
          <div>
            <b>{highestSeverity === 'ok' ? 'Ввод прошёл базовую проверку' : highestSeverity === 'warning' ? 'Есть предупреждения по данным' : 'Есть ошибки ввода'}</b>
            <span>{report.issues.length ? `${report.issues.length} замечаний. Проверьте перед клинической интерпретацией.` : 'Ошибок и предупреждений не найдено.'}</span>
          </div>
        </section>
      ) : null}

      <div className="grid">
        <section className="card form-card">
          <h2><Eye size={20} /> Пациент и режим</h2>
          <label className="field">
            <span>ID пациента / кейса</span>
            <input value={input.patientId ?? ''} onChange={(e) => patch('patientId', e.currentTarget.value)} placeholder="Например: Case-001" />
          </label>
          <div className="segmented">
            {(['OD', 'OS'] as EyeSide[]).map((eye) => (
              <button key={eye} className={input.eye === eye ? 'active' : ''} onClick={() => patch('eye', eye)}>{eye}</button>
            ))}
          </div>
          <div className="segmented wrap">
            {(Object.keys(modeLabels) as CalculationMode[]).map((mode) => (
              <button key={mode} className={input.mode === mode ? 'active' : ''} onClick={() => patch('mode', mode)}>{modeLabels[mode]}</button>
            ))}
          </div>
          <label className="field">
            <span>Модель ИОЛ</span>
            <select value={selectedLensId} onChange={(event) => setSelectedLensId(event.currentTarget.value)}>
              {lensCatalog.map((item) => <option value={item.id} key={item.id}>{item.manufacturer} — {item.name}</option>)}
            </select>
            <small>{lens?.constantSource}</small>
          </label>
        </section>

        <section className="card form-card">
          <h2>Биометрия</h2>
          <NumberField label="Axial Length" value={input.axialLength} onChange={(v) => patch('axialLength', v ?? 0)} suffix="mm" />
          <div className="two">
            <NumberField label="K1" value={input.k1} onChange={(v) => patch('k1', v ?? 0)} suffix="D" />
            <NumberField label="Axis K1" value={input.k1Axis} onChange={(v) => patch('k1Axis', v ?? 0)} step={1} suffix="°" />
          </div>
          <div className="two">
            <NumberField label="K2" value={input.k2} onChange={(v) => patch('k2', v ?? 0)} suffix="D" />
            <NumberField label="Axis K2" value={input.k2Axis} onChange={(v) => patch('k2Axis', v ?? 0)} step={1} suffix="°" />
          </div>
          <NumberField label="Target refraction" value={input.targetRefraction} onChange={(v) => patch('targetRefraction', v ?? 0)} suffix="D" />
        </section>

        <section className="card form-card">
          <h2>ELP-параметры</h2>
          <NumberField label="ACD" value={input.anteriorChamberDepth} onChange={(v) => patch('anteriorChamberDepth', v)} suffix="mm" />
          <NumberField label="Lens Thickness" value={input.lensThickness} onChange={(v) => patch('lensThickness', v)} suffix="mm" />
          <NumberField label="White-to-White" value={input.whiteToWhite} onChange={(v) => patch('whiteToWhite', v)} suffix="mm" />
          <NumberField label="CCT" value={input.centralCornealThickness} onChange={(v) => patch('centralCornealThickness', v)} suffix="µm" />
        </section>

        <section className="card form-card">
          <h2>Toric / хирургические параметры</h2>
          <NumberField label="Incision axis" value={input.incisionAxis} onChange={(v) => patch('incisionAxis', v)} step={1} suffix="°" />
          <NumberField label="SIA" value={input.surgicallyInducedAstigmatism} onChange={(v) => patch('surgicallyInducedAstigmatism', v)} suffix="D" />
          <label className="field">
            <span>Posterior cornea</span>
            <select value={input.posteriorCorneaMode} onChange={(e) => patch('posteriorCorneaMode', e.currentTarget.value as BiometryInput['posteriorCorneaMode'])}>
              <option value="measured">Measured</option>
              <option value="nomogram">Nomogram</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label className="field">
            <span>Заметки</span>
            <textarea value={input.notes ?? ''} onChange={(e) => patch('notes', e.currentTarget.value)} placeholder="Например: post-myopic LASIK, poor fixation, dense cataract..." />
          </label>
        </section>
      </div>

      {report ? (
        <section className="results">
          <h2>Результаты</h2>
          {report.issues.length ? (
            <div className="issue-list">
              {report.issues.map((issue, index) => (
                <div className={`issue ${issue.severity}`} key={`${issue.field}-${index}`}>
                  <Info size={16} />
                  <span><b>{issue.severity.toUpperCase()}</b> · {issue.field}: {issue.message}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="result-grid">
            {report.results.map((result) => (
              <article className={`result-card ${result.status}`} key={result.formulaId}>
                <div className="result-head">
                  <b>{result.formulaName}</b>
                  <span>{result.status}</span>
                </div>
                {typeof result.recommendedIolPower === 'number' ? (
                  <div className="power">{result.recommendedIolPower.toFixed(1)} D</div>
                ) : (
                  <div className="locked">Connector required</div>
                )}
                {typeof result.predictedRefraction === 'number' ? <p>Predicted refraction: {result.predictedRefraction.toFixed(2)} D</p> : null}
                <ul>
                  {result.messages.map((message) => <li key={message}>{message}</li>)}
                </ul>
              </article>
            ))}
          </div>

          {report.toricCandidates.length ? (
            <section className="card table-card">
              <h3>Toric candidates</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>IOL cyl</th>
                      <th>Corneal eq.</th>
                      <th>Axis</th>
                      <th>Residual</th>
                      <th>5° rot.</th>
                      <th>10° rot.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.toricCandidates.map((candidate) => (
                      <tr key={`${candidate.iolCylinderPlane}-${candidate.axis}`}>
                        <td>{candidate.iolCylinderPlane.toFixed(2)}</td>
                        <td>{candidate.estimatedCornealPlane.toFixed(2)}</td>
                        <td>{candidate.axis}°</td>
                        <td>{candidate.residualCylinder.toFixed(2)} @ {candidate.residualAxis}°</td>
                        <td>{candidate.rotationPenalty5deg.toFixed(2)}</td>
                        <td>{candidate.rotationPenalty10deg.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="card audit-card">
            <h3>Audit trail</h3>
            <pre>{report.auditTrail.join('\n')}</pre>
            <button onClick={() => downloadText(`iolpro-audit-${Date.now()}.txt`, report.auditTrail.join('\n'), 'text/plain')}><Download size={16} /> Скачать аудит</button>
          </section>
        </section>
      ) : null}
    </main>
  );
}
