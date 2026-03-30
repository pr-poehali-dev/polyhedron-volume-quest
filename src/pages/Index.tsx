import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Task {
  id: number;
  level: number;
  shape: string;
  shapeIcon: string;
  image: string;
  question: string;
  formula: string;
  formulaLabel: string;
  given: { label: string; value: string }[];
  answer: number;
  unit: string;
  hint: string;
  explanation: string;
  maxPoints: number;
}

interface ResultEntry {
  name: string;
  score: number;
  maxScore: number;
  correct: number;
  total: number;
  date: string;
}

const IMG_CUBE = "https://cdn.poehali.dev/projects/aa07a7aa-164b-4433-80ab-6d2424b93556/files/47d792bd-3477-436a-94ec-955ae1ac13c2.jpg";
const IMG_BOX = "https://cdn.poehali.dev/projects/aa07a7aa-164b-4433-80ab-6d2424b93556/files/529cd37c-0bd4-4858-b9b6-4646a08c09c8.jpg";
const IMG_PRISM = "https://cdn.poehali.dev/projects/aa07a7aa-164b-4433-80ab-6d2424b93556/files/b43fb8c6-2f5a-41c9-9bf0-335a140ee4b3.jpg";
const IMG_PYRAMID = "https://cdn.poehali.dev/projects/aa07a7aa-164b-4433-80ab-6d2424b93556/files/11d3fabd-35b4-4539-b6d2-aca22f77d381.jpg";
const IMG_COMPOSITE = "https://cdn.poehali.dev/projects/aa07a7aa-164b-4433-80ab-6d2424b93556/files/6256e128-aaee-4e23-905e-0f54f74b0eca.jpg";

const TASKS: Task[] = [
  {
    id: 1, level: 1, shape: "Куб", shapeIcon: "Box", image: IMG_CUBE,
    question: "Найдите объём куба со стороной 4 см.",
    formula: "V = a³", formulaLabel: "Объём куба",
    given: [{ label: "Сторона a", value: "4 см" }],
    answer: 64, unit: "см³",
    hint: "Куб — фигура, у которой все рёбра одинаковы. Возведите сторону в третью степень.",
    explanation: "V = a³ = 4³ = 4 × 4 × 4 = 64 см³",
    maxPoints: 10,
  },
  {
    id: 2, level: 1, shape: "Куб", shapeIcon: "Box", image: IMG_CUBE,
    question: "Найдите объём куба, если его ребро равно 7 см.",
    formula: "V = a³", formulaLabel: "Объём куба",
    given: [{ label: "Сторона a", value: "7 см" }],
    answer: 343, unit: "см³",
    hint: "7³ = 7 × 7 × 7. Сначала найдите 7 × 7, затем умножьте на 7.",
    explanation: "V = 7³ = 7 × 7 × 7 = 49 × 7 = 343 см³",
    maxPoints: 10,
  },
  {
    id: 3, level: 2, shape: "Прямоугольный параллелепипед", shapeIcon: "RectangleHorizontal", image: IMG_BOX,
    question: "Найдите объём прямоугольного параллелепипеда с длиной 6 см, шириной 4 см и высотой 5 см.",
    formula: "V = a · b · h", formulaLabel: "Объём параллелепипеда",
    given: [{ label: "Длина a", value: "6 см" }, { label: "Ширина b", value: "4 см" }, { label: "Высота h", value: "5 см" }],
    answer: 120, unit: "см³",
    hint: "Перемножьте все три измерения: длину, ширину и высоту.",
    explanation: "V = a · b · h = 6 × 4 × 5 = 120 см³",
    maxPoints: 10,
  },
  {
    id: 4, level: 2, shape: "Прямоугольный параллелепипед", shapeIcon: "RectangleHorizontal", image: IMG_BOX,
    question: "Аквариум имеет форму прямоугольного параллелепипеда: длина 80 см, ширина 30 см, высота 40 см. Найдите его объём в литрах.",
    formula: "V = a · b · h", formulaLabel: "Объём параллелепипеда",
    given: [{ label: "Длина a", value: "80 см" }, { label: "Ширина b", value: "30 см" }, { label: "Высота h", value: "40 см" }],
    answer: 96, unit: "литров",
    hint: "Сначала найдите объём в см³, затем переведите в литры: 1 литр = 1000 см³.",
    explanation: "V = 80 × 30 × 40 = 96 000 см³ = 96 литров",
    maxPoints: 10,
  },
  {
    id: 5, level: 3, shape: "Правильная треугольная призма", shapeIcon: "Triangle", image: IMG_PRISM,
    question: "Основание правильной треугольной призмы — равносторонний треугольник со стороной 6 см. Высота призмы 10 см. Найдите объём.",
    formula: "V = S · h,  S = (a² · √3) / 4", formulaLabel: "Объём призмы",
    given: [{ label: "Сторона основания a", value: "6 см" }, { label: "Высота призмы h", value: "10 см" }],
    answer: 156, unit: "см³",
    hint: "Площадь равностороннего треугольника: S = (a² × √3) / 4 ≈ (36 × 1,732) / 4 ≈ 15,6 см². Умножьте на высоту.",
    explanation: "S = (6² × √3) / 4 = (36 × 1,732) / 4 ≈ 15,6 см²\nV = S × h = 15,6 × 10 = 156 см³",
    maxPoints: 15,
  },
  {
    id: 6, level: 3, shape: "Прямая призма", shapeIcon: "Triangle", image: IMG_PRISM,
    question: "В основании прямой призмы лежит прямоугольный треугольник с катетами 3 и 4 см. Высота призмы 12 см. Найдите объём.",
    formula: "V = S · h,  S = (a · b) / 2", formulaLabel: "Объём призмы",
    given: [{ label: "Катет a", value: "3 см" }, { label: "Катет b", value: "4 см" }, { label: "Высота h", value: "12 см" }],
    answer: 72, unit: "см³",
    hint: "Площадь прямоугольного треугольника равна половине произведения катетов: S = (3 × 4) / 2 = 6 см².",
    explanation: "S = (3 × 4) / 2 = 6 см²\nV = S × h = 6 × 12 = 72 см³",
    maxPoints: 15,
  },
  {
    id: 7, level: 4, shape: "Правильная пирамида", shapeIcon: "Mountain", image: IMG_PYRAMID,
    question: "Найдите объём правильной четырёхугольной пирамиды, если сторона основания 6 см, высота 8 см.",
    formula: "V = (1/3) · S · h", formulaLabel: "Объём пирамиды",
    given: [{ label: "Сторона основания a", value: "6 см" }, { label: "Высота h", value: "8 см" }],
    answer: 96, unit: "см³",
    hint: "Основание — квадрат со стороной 6 см. S = 6² = 36 см². Объём пирамиды в три раза меньше объёма призмы с тем же основанием.",
    explanation: "S = 6² = 36 см²\nV = (1/3) × S × h = (1/3) × 36 × 8 = 96 см³",
    maxPoints: 15,
  },
  {
    id: 8, level: 4, shape: "Правильная пирамида", shapeIcon: "Mountain", image: IMG_PYRAMID,
    question: "Высота правильной треугольной пирамиды равна 9 см, сторона правильного треугольника в основании — 6 см. Найдите объём.",
    formula: "V = (1/3) · S · h", formulaLabel: "Объём пирамиды",
    given: [{ label: "Сторона основания a", value: "6 см" }, { label: "Высота h", value: "9 см" }],
    answer: 47, unit: "см³",
    hint: "S треугольника = (6² × √3) / 4 ≈ 15,6 см². Затем V = (1/3) × S × h. Округлите до целых.",
    explanation: "S = (6² × √3) / 4 ≈ 15,6 см²\nV = (1/3) × 15,6 × 9 = 46,8 ≈ 47 см³",
    maxPoints: 15,
  },
  {
    id: 9, level: 5, shape: "Составная фигура", shapeIcon: "Layers", image: IMG_COMPOSITE,
    question: "Фигура состоит из куба со стороной 4 см и пирамиды, стоящей на верхней грани куба. Высота пирамиды 3 см. Найдите суммарный объём фигуры.",
    formula: "V = V куба + V пирамиды", formulaLabel: "Суммарный объём",
    given: [{ label: "Ребро куба a", value: "4 см" }, { label: "Высота пирамиды h", value: "3 см" }],
    answer: 80, unit: "см³",
    hint: "Найдите объём каждой фигуры отдельно, затем сложите. Основание пирамиды — квадрат 4 × 4 см.",
    explanation: "V куба = 4³ = 64 см³\nV пирамиды = (1/3) × 4² × 3 = 16 см³\nV = 64 + 16 = 80 см³",
    maxPoints: 20,
  },
  {
    id: 10, level: 5, shape: "Составная фигура", shapeIcon: "Layers", image: IMG_COMPOSITE,
    question: "Из куба со стороной 10 см вырезали прямоугольный параллелепипед: длина 10 см, ширина 4 см, высота 6 см. Найдите объём оставшейся фигуры.",
    formula: "V = V куба − V выреза", formulaLabel: "Оставшийся объём",
    given: [{ label: "Ребро куба", value: "10 см" }, { label: "Длина выреза", value: "10 см" }, { label: "Ширина выреза", value: "4 см" }, { label: "Высота выреза", value: "6 см" }],
    answer: 760, unit: "см³",
    hint: "Найдите объём куба, затем объём вырезанного параллелепипеда. Вычтите второй из первого.",
    explanation: "V куба = 10³ = 1000 см³\nV выреза = 10 × 4 × 6 = 240 см³\nV = 1000 − 240 = 760 см³",
    maxPoints: 20,
  },
];

const MAX_TOTAL = TASKS.reduce((s, t) => s + t.maxPoints, 0);

const LEVELS = [
  { id: 1, label: "Куб" },
  { id: 2, label: "Параллелепипед" },
  { id: 3, label: "Призма" },
  { id: 4, label: "Пирамида" },
  { id: 5, label: "Составные" },
];

function getGrade(pct: number) {
  if (pct >= 85) return { label: "Отлично", mark: "5", color: "var(--quest-success)" };
  if (pct >= 65) return { label: "Хорошо", mark: "4", color: "#2563EB" };
  if (pct >= 40) return { label: "Удовлетворительно", mark: "3", color: "var(--quest-hint)" };
  return { label: "Неудовлетворительно", mark: "2", color: "var(--quest-error)" };
}

type TaskState = "idle" | "correct" | "wrong";
type Screen = "quest" | "finish" | "leaderboard";

const LS_KEY = "math_quest_results";

function loadResults(): ResultEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch { return []; }
}

function saveResult(entry: ResultEntry) {
  const all = loadResults();
  all.push(entry);
  all.sort((a, b) => b.score - a.score);
  localStorage.setItem(LS_KEY, JSON.stringify(all.slice(0, 50)));
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>("quest");
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameSet, setNameSet] = useState(false);

  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [input, setInput] = useState("");
  const [taskState, setTaskState] = useState<TaskState>("idle");
  const [showHint, setShowHint] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<number, number>>({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [results, setResults] = useState<ResultEntry[]>(loadResults());

  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const task = TASKS[currentTaskIdx];
  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const progress = (completed.size / TASKS.length) * 100;

  useEffect(() => {
    setInput("");
    setTaskState("idle");
    setShowHint(false);
    setShowFormula(false);
    setShowExplanation(false);
    setWrongAttempts(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [currentTaskIdx]);

  const calcPoints = (attempts: number, maxPts: number) => {
    if (attempts === 0) return maxPts;
    if (attempts === 1) return Math.round(maxPts * 0.7);
    return Math.round(maxPts * 0.4);
  };

  const handleCheck = () => {
    const userVal = Math.round(parseFloat(input.replace(",", ".")));
    if (isNaN(userVal)) return;

    if (Math.abs(userVal - task.answer) < 0.6) {
      const pts = calcPoints(wrongAttempts, task.maxPoints);
      setTaskState("correct");
      setScores((prev) => ({ ...prev, [task.id]: pts }));
      setCompleted((prev) => {
        const next = new Set([...prev, task.id]);
        if (next.size === TASKS.length) {
          const newScore = totalScore + pts;
          const entry: ResultEntry = {
            name: playerName || "Аноним",
            score: newScore,
            maxScore: MAX_TOTAL,
            correct: next.size,
            total: TASKS.length,
            date: new Date().toLocaleDateString("ru-RU"),
          };
          saveResult(entry);
          setResults(loadResults());
          setTimeout(() => setScreen("finish"), 900);
        }
        return next;
      });
    } else {
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);
      setTaskState("wrong");
      setShakeKey((k) => k + 1);
      setShowHint(true);
      if (attempts >= 2) {
        setScores((prev) => ({ ...prev, [task.id]: 0 }));
        setCompleted((prev) => {
          const next = new Set([...prev, task.id]);
          if (next.size === TASKS.length) {
            const entry: ResultEntry = {
              name: playerName || "Аноним",
              score: totalScore,
              maxScore: MAX_TOTAL,
              correct: [...next].filter((id) => (scores[id] ?? 0) > 0).length,
              total: TASKS.length,
              date: new Date().toLocaleDateString("ru-RU"),
            };
            saveResult(entry);
            setResults(loadResults());
            setTimeout(() => setScreen("finish"), 1200);
          }
          return next;
        });
      }
    }
  };

  const handleNext = () => {
    if (currentTaskIdx < TASKS.length - 1) setCurrentTaskIdx((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentTaskIdx > 0) setCurrentTaskIdx((i) => i - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { if (taskState === "correct") handleNext(); else handleCheck(); }
  };

  const handleRestart = () => {
    setCurrentTaskIdx(0);
    setCompleted(new Set());
    setScores({});
    setScreen("quest");
    setInput("");
    setTaskState("idle");
    setNameSet(false);
    setNameInput("");
    setPlayerName("");
  };

  // ── NAME SCREEN ──
  if (!nameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--quest-bg)" }}>
        <div className="quest-card quest-fade-in p-10 max-w-sm w-full mx-4 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "var(--quest-accent-light)" }}>
            <Icon name="GraduationCap" size={24} style={{ color: "var(--quest-accent)" }} />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--quest-text)" }}>
            Веб-квест
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--quest-muted)" }}>
            Объёмы многогранников · 10 задач
          </p>
          <input
            ref={nameRef}
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && (setPlayerName(nameInput.trim()), setNameSet(true))}
            placeholder="Введите своё имя..."
            maxLength={30}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-3"
            style={{ border: "1.5px solid var(--quest-border)", backgroundColor: "var(--quest-surface)", color: "var(--quest-text)" }}
            autoFocus
          />
          <button
            onClick={() => { if (nameInput.trim()) { setPlayerName(nameInput.trim()); setNameSet(true); } }}
            disabled={!nameInput.trim()}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: "var(--quest-accent)", color: "#fff" }}
          >
            Начать квест
          </button>
          <button
            onClick={() => setScreen("leaderboard")}
            className="mt-3 w-full py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
            style={{ color: "var(--quest-muted)" }}
          >
            <Icon name="Trophy" size={14} />
            Таблица результатов
          </button>
        </div>
      </div>
    );
  }

  // ── FINISH SCREEN ──
  const handlePrint = () => {
    const pct = Math.round((totalScore / MAX_TOTAL) * 100);
    const grade = getGrade(pct);
    const rows = TASKS.map((t) => {
      const earned = scores[t.id] ?? 0;
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${t.id}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${t.shape}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${earned} / ${t.maxPoints}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${earned > 0 ? "✓" : "✗"}</td>
      </tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Результат квеста — ${playerName}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 32px; max-width: 600px; margin: 0 auto; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .sub { color: #888; font-size: 13px; margin-bottom: 24px; }
      .grade-box { display:inline-flex; flex-direction:column; align-items:center; justify-content:center;
        width:100px; height:100px; border-radius:50%; border:4px solid ${grade.color};
        background:${grade.color}18; margin-bottom:20px; }
      .grade-num { font-size:48px; font-weight:bold; color:${grade.color}; line-height:1; }
      .grade-lbl { font-size:11px; color:${grade.color}; font-weight:600; margin-top:4px; }
      .stats { display:flex; gap:32px; margin-bottom:24px; }
      .stat-val { font-size:28px; font-weight:bold; color:${grade.color}; }
      .stat-lbl { font-size:11px; color:#888; margin-top:2px; }
      table { width:100%; border-collapse:collapse; font-size:13px; }
      th { text-align:left; padding:8px 10px; background:#f5f5f5; font-weight:600; font-size:12px; color:#666; }
      .scale { font-size:11px; color:#888; margin-top:6px; }
      .footer { margin-top:28px; font-size:11px; color:#aaa; border-top:1px solid #eee; padding-top:12px; }
    </style></head><body>
    <h1>${playerName}</h1>
    <p class="sub">Веб-квест · Объёмы многогранников · ${new Date().toLocaleDateString("ru-RU")}</p>
    <div class="grade-box">
      <span class="grade-num">${grade.mark}</span>
      <span class="grade-lbl">${grade.label}</span>
    </div>
    <div class="stats">
      <div><div class="stat-val">${totalScore}</div><div class="stat-lbl">из ${MAX_TOTAL} баллов</div></div>
      <div><div class="stat-val">${pct}%</div><div class="stat-lbl">результат</div></div>
    </div>
    <p class="scale">Шкала оценок: «2» &lt;40% · «3» 40–64% · «4» 65–84% · «5» ≥85%</p>
    <br/>
    <table>
      <thead><tr>
        <th>#</th><th>Фигура</th><th style="text-align:center">Баллы</th><th style="text-align:center">Верно</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">Сформировано автоматически · poehali.dev</div>
    </body></html>`
    + `<scr` + `ipt>window.onload=()=>{window.print();}</scr` + `ipt>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  };

  if (screen === "finish") {
    const pct = Math.round((totalScore / MAX_TOTAL) * 100);
    const grade = getGrade(pct);
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--quest-bg)" }}>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          {/* Result card */}
          <div className="quest-card quest-fade-in p-8 text-center">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--quest-text)" }}>
              {playerName}
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--quest-muted)" }}>квест завершён</p>

            {/* Grade badge */}
            <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 mx-auto mb-6"
              style={{ borderColor: grade.color, backgroundColor: grade.color + "18" }}>
              <p className="text-5xl font-bold leading-none" style={{ color: grade.color }}>{grade.mark}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: grade.color }}>{grade.label}</p>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-3xl font-bold" style={{ color: grade.color }}>{totalScore}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--quest-muted)" }}>из {MAX_TOTAL} баллов</p>
              </div>
              <div style={{ width: 1, height: 48, backgroundColor: "var(--quest-border)" }} />
              <div>
                <p className="text-3xl font-bold" style={{ color: "var(--quest-text)" }}>{pct}%</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--quest-muted)" }}>результат</p>
              </div>
            </div>

            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: grade.color }} />
            </div>
            <div className="flex justify-between text-xs mb-4" style={{ color: "var(--quest-muted)" }}>
              <span>«2» &lt;40%</span><span>«3» 40–64%</span><span>«4» 65–84%</span><span>«5» ≥85%</span>
            </div>
          </div>

          {/* Per-task breakdown */}
          <div className="quest-card p-6">
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--quest-text)" }}>Разбор по задачам</h2>
            <div className="space-y-2">
              {TASKS.map((t) => {
                const earned = scores[t.id] ?? 0;
                const isPerfect = earned === t.maxPoints;
                const isDone = completed.has(t.id);
                return (
                  <div key={t.id} className="flex items-center gap-3 py-2 border-b last:border-0"
                    style={{ borderColor: "var(--quest-border)" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isDone ? (isPerfect ? "var(--quest-success-light)" : "var(--quest-accent-light)") : "var(--quest-border)" }}>
                      {isDone
                        ? <Icon name="Check" size={11} style={{ color: isPerfect ? "var(--quest-success)" : "var(--quest-accent)" }} />
                        : <Icon name="Minus" size={11} style={{ color: "var(--quest-muted)" }} />}
                    </div>
                    <span className="flex-1 text-sm" style={{ color: "var(--quest-text)" }}>
                      Задача {t.id} · {t.shape}
                    </span>
                    <span className="text-sm font-mono font-medium" style={{ color: isDone ? (isPerfect ? "var(--quest-success)" : "var(--quest-accent)") : "var(--quest-muted)" }}>
                      {earned} / {t.maxPoints}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleRestart} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: "var(--quest-accent)", color: "#fff" }}>
              Пройти снова
            </button>
            <button onClick={() => setScreen("leaderboard")} className="py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--quest-surface)", color: "var(--quest-text)", border: "1px solid var(--quest-border)" }}>
              <Icon name="Trophy" size={14} />
              Таблица
            </button>
            <button onClick={handlePrint} className="py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--quest-surface)", color: "var(--quest-text)", border: "1px solid var(--quest-border)" }}>
              <Icon name="Printer" size={14} />
              Печать
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD ──
  if (screen === "leaderboard") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--quest-bg)" }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen(nameSet ? "quest" : "quest")} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: "1px solid var(--quest-border)", backgroundColor: "var(--quest-surface)" }}>
              <Icon name="ArrowLeft" size={14} style={{ color: "var(--quest-muted)" }} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: "var(--quest-text)" }}>Таблица результатов</h1>
          </div>

          {results.length === 0 ? (
            <div className="quest-card p-12 text-center">
              <Icon name="Trophy" size={32} style={{ color: "var(--quest-border)", margin: "0 auto 12px" }} />
              <p className="text-sm" style={{ color: "var(--quest-muted)" }}>Результатов пока нет. Пройдите квест первым!</p>
            </div>
          ) : (
            <div className="quest-card overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-medium border-b"
                style={{ borderColor: "var(--quest-border)", color: "var(--quest-muted)", backgroundColor: "var(--quest-bg)" }}>
                <div className="col-span-1">#</div>
                <div className="col-span-4">Имя</div>
                <div className="col-span-3 text-right">Баллы</div>
                <div className="col-span-2 text-right">%</div>
                <div className="col-span-2 text-right">Оценка</div>
              </div>
              {results.map((r, i) => {
                const pct = Math.round((r.score / r.maxScore) * 100);
                const grade = getGrade(pct);
                const isMe = r.name === playerName;
                return (
                  <div key={i} className="grid grid-cols-12 gap-2 px-5 py-3 border-b last:border-0 items-center transition-all"
                    style={{
                      borderColor: "var(--quest-border)",
                      backgroundColor: isMe ? "var(--quest-accent-light)" : "transparent",
                    }}>
                    <div className="col-span-1">
                      {i === 0
                        ? <span className="text-base">🥇</span>
                        : i === 1
                        ? <span className="text-base">🥈</span>
                        : i === 2
                        ? <span className="text-base">🥉</span>
                        : <span className="text-sm font-mono" style={{ color: "var(--quest-muted)" }}>{i + 1}</span>
                      }
                    </div>
                    <div className="col-span-4">
                      <span className="text-sm font-medium" style={{ color: isMe ? "var(--quest-accent)" : "var(--quest-text)" }}>
                        {r.name}
                      </span>
                      {isMe && (
                        <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--quest-accent)", color: "#fff" }}>вы</span>
                      )}
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="text-sm font-mono font-medium" style={{ color: "var(--quest-text)" }}>{r.score}</span>
                      <span className="text-xs ml-1" style={{ color: "var(--quest-muted)" }}>/ {r.maxScore}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-mono" style={{ color: grade.color }}>{pct}%</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-bold" style={{ color: grade.color }}>«{grade.mark}»</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button onClick={handleRestart} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: "var(--quest-accent)", color: "#fff" }}>
              Новая попытка
            </button>
            {results.length > 0 && (
              <button
                onClick={() => { localStorage.removeItem(LS_KEY); setResults([]); }}
                className="px-4 py-3 rounded-lg text-sm transition-all"
                style={{ border: "1px solid var(--quest-border)", color: "var(--quest-muted)", backgroundColor: "var(--quest-surface)" }}>
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── QUEST ──
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--quest-bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b"
        style={{ backgroundColor: "var(--quest-surface)", borderColor: "var(--quest-border)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--quest-text)" }}>
                {playerName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Icon name="Star" size={13} style={{ color: "var(--quest-hint)" }} />
                <span className="text-sm font-mono font-medium" style={{ color: "var(--quest-hint)" }}>
                  {totalScore}
                </span>
                <span className="text-xs" style={{ color: "var(--quest-muted)" }}>/ {MAX_TOTAL}</span>
              </div>
              <button onClick={() => setScreen("leaderboard")}
                className="flex items-center gap-1 text-xs transition-all"
                style={{ color: "var(--quest-muted)" }}>
                <Icon name="Trophy" size={13} />
                Рейтинг
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-1 mt-3">
            {LEVELS.map((lvl) => {
              const levelTasks = TASKS.filter((t) => t.level === lvl.id);
              const allDone = levelTasks.every((t) => completed.has(t.id));
              const isCurrent = task.level === lvl.id;
              return (
                <button key={lvl.id}
                  onClick={() => { const idx = TASKS.findIndex((t) => t.level === lvl.id); if (idx !== -1) setCurrentTaskIdx(idx); }}
                  className="flex-1 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: isCurrent ? "var(--quest-accent-light)" : allDone ? "var(--quest-success-light)" : "transparent",
                    color: isCurrent ? "var(--quest-accent)" : allDone ? "var(--quest-success)" : "var(--quest-muted)",
                    border: isCurrent ? "1px solid var(--quest-accent)" : "1px solid transparent",
                  }}>
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div key={task.id} className="quest-fade-in space-y-4">
          {/* Task header */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded"
              style={{ backgroundColor: "var(--quest-accent-light)", color: "var(--quest-accent)" }}>
              Задача {task.id}
            </span>
            <span className="text-xs" style={{ color: "var(--quest-muted)" }}>{task.shape}</span>
            <div className="flex-1" />
            {/* Points badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded"
              style={{ backgroundColor: "var(--quest-hint-light)" }}>
              <Icon name="Star" size={11} style={{ color: "var(--quest-hint)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--quest-hint)" }}>
                {scores[task.id] !== undefined
                  ? `${scores[task.id]} / ${task.maxPoints}`
                  : `до ${task.maxPoints}`} б.
              </span>
            </div>
            <div className="flex gap-1">
              {TASKS.filter((t) => t.level === task.level).map((t) => (
                <button key={t.id}
                  onClick={() => setCurrentTaskIdx(TASKS.findIndex((x) => x.id === t.id))}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: completed.has(t.id) ? "var(--quest-success)" : t.id === task.id ? "var(--quest-accent)" : "var(--quest-border)" }}
                />
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="quest-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 w-full h-44 sm:h-auto flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "var(--quest-bg)" }}>
                <img src={task.image} alt={task.shape}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center" }} />
              </div>
              <div className="flex-1 p-6">
                <p className="text-base leading-relaxed font-medium mb-4" style={{ color: "var(--quest-text)" }}>
                  {task.question}
                </p>
                <div className="pt-4 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--quest-border)" }}>
                  {task.given.map((g) => (
                    <div key={g.label} className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: "var(--quest-muted)" }}>{g.label}:</span>
                      <span className="text-sm font-medium font-mono" style={{ color: "var(--quest-text)" }}>{g.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scoring hint */}
          {taskState === "idle" && !completed.has(task.id) && (
            <p className="text-xs" style={{ color: "var(--quest-muted)" }}>
              За правильный ответ с первой попытки — {task.maxPoints} б.,
              со второй — {Math.round(task.maxPoints * 0.7)} б.,
              далее — {Math.round(task.maxPoints * 0.4)} б.
            </p>
          )}

          {/* Formula toggle */}
          <button onClick={() => setShowFormula(!showFormula)}
            className="flex items-center gap-2 text-sm transition-all" style={{ color: "var(--quest-accent)" }}>
            <Icon name={showFormula ? "ChevronDown" : "ChevronRight"} size={14} />
            {showFormula ? "Скрыть формулу" : "Показать формулу"}
          </button>

          {showFormula && (
            <div className="quest-card quest-fade-in p-4 flex items-start gap-3" style={{ borderColor: "var(--quest-accent)" }}>
              <Icon name="BookOpen" size={16} style={{ color: "var(--quest-accent)", marginTop: 2 }} />
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--quest-muted)" }}>{task.formulaLabel}</p>
                <p className="text-base font-mono font-medium" style={{ color: "var(--quest-text)" }}>{task.formula}</p>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="quest-card quest-fade-in p-4 flex items-start gap-3"
              style={{ backgroundColor: "var(--quest-hint-light)", borderColor: "var(--quest-hint)" }}>
              <Icon name="Lightbulb" size={16} style={{ color: "var(--quest-hint)", marginTop: 2, flexShrink: 0 }} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--quest-hint)" }}>{task.hint}</p>
            </div>
          )}

          {!showHint && (
            <button onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-sm transition-all" style={{ color: "var(--quest-hint)" }}>
              <Icon name="Lightbulb" size={14} />
              Подсказка
            </button>
          )}

          {/* Answer */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color: "var(--quest-muted)" }}>
              Ваш ответ ({task.unit})
            </label>
            <div key={shakeKey} className={shakeKey > 0 ? "quest-shake" : ""}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="number"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); if (taskState === "wrong") setTaskState("idle"); }}
                    onKeyDown={handleKeyDown}
                    disabled={taskState === "correct"}
                    placeholder="Введите число..."
                    className="w-full px-4 py-3 rounded-lg text-base outline-none transition-all font-mono"
                    style={{
                      border: `1.5px solid ${taskState === "correct" ? "var(--quest-success)" : taskState === "wrong" ? "var(--quest-error)" : "var(--quest-border)"}`,
                      backgroundColor: taskState === "correct" ? "var(--quest-success-light)" : taskState === "wrong" ? "var(--quest-error-light)" : "var(--quest-surface)",
                      color: "var(--quest-text)",
                    }}
                  />
                  {taskState === "correct" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--quest-success)" }}>
                      <Icon name="Check" size={18} />
                    </div>
                  )}
                  {taskState === "wrong" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--quest-error)" }}>
                      <Icon name="X" size={18} />
                    </div>
                  )}
                </div>
                <button
                  onClick={taskState === "correct" || (taskState === "wrong" && wrongAttempts >= 2) ? handleNext : handleCheck}
                  disabled={!input && taskState !== "wrong"}
                  className="px-5 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                  style={{ backgroundColor: taskState === "correct" ? "var(--quest-success)" : taskState === "wrong" && wrongAttempts >= 2 ? "var(--quest-error)" : "var(--quest-accent)", color: "#fff" }}>
                  {taskState === "correct"
                    ? currentTaskIdx < TASKS.length - 1 ? "Далее" : "Финиш"
                    : taskState === "wrong" && wrongAttempts >= 2
                    ? currentTaskIdx < TASKS.length - 1 ? "Далее" : "Финиш"
                    : "Проверить"}
                </button>
              </div>
            </div>

            {taskState === "wrong" && wrongAttempts < 2 && (
              <p className="text-xs mt-2 quest-fade-in" style={{ color: "var(--quest-error)" }}>
                Неверно. Осталась 1 попытка.
              </p>
            )}
            {taskState === "wrong" && wrongAttempts >= 2 && (
              <p className="text-xs mt-2 quest-fade-in" style={{ color: "var(--quest-error)" }}>
                Попытки исчерпаны. 0 баллов за эту задачу. Посмотрите решение.
              </p>
            )}

            {taskState === "correct" && (
              <div className="flex items-center gap-3 mt-2 quest-fade-in">
                <p className="text-xs font-medium" style={{ color: "var(--quest-success)" }}>
                  Верно! {task.answer} {task.unit}
                </p>
                <span className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ backgroundColor: "var(--quest-success-light)", color: "var(--quest-success)" }}>
                  +{scores[task.id]} б.
                </span>
              </div>
            )}
          </div>

          {/* Explanation */}
          {(taskState === "correct" || (taskState === "wrong" && wrongAttempts >= 2)) && (
            <div className="quest-fade-in">
              <button onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-sm" style={{ color: "var(--quest-success)" }}>
                <Icon name={showExplanation ? "ChevronDown" : "ChevronRight"} size={14} />
                {showExplanation ? "Скрыть решение" : "Посмотреть решение"}
              </button>
              {showExplanation && (
                <div className="quest-card quest-fade-in p-4 mt-2"
                  style={{ backgroundColor: "var(--quest-success-light)", borderColor: "var(--quest-success)" }}>
                  <p className="text-sm font-mono whitespace-pre-line leading-relaxed" style={{ color: "var(--quest-text)" }}>
                    {task.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--quest-border)" }}>
            <button onClick={handlePrev} disabled={currentTaskIdx === 0}
              className="flex items-center gap-1.5 text-sm transition-all disabled:opacity-30"
              style={{ color: "var(--quest-muted)" }}>
              <Icon name="ArrowLeft" size={14} />Назад
            </button>
            <span className="text-xs" style={{ color: "var(--quest-muted)" }}>
              {currentTaskIdx + 1} из {TASKS.length}
            </span>
            <button onClick={handleNext} disabled={currentTaskIdx === TASKS.length - 1}
              className="flex items-center gap-1.5 text-sm transition-all disabled:opacity-30"
              style={{ color: "var(--quest-muted)" }}>
              Вперёд<Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}