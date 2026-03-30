import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Task {
  id: number;
  level: number;
  shape: string;
  shapeIcon: string;
  question: string;
  formula: string;
  formulaLabel: string;
  given: { label: string; value: string }[];
  answer: number;
  unit: string;
  hint: string;
  explanation: string;
}

const TASKS: Task[] = [
  {
    id: 1,
    level: 1,
    shape: "Куб",
    shapeIcon: "Box",
    question: "Найдите объём куба со стороной 4 см.",
    formula: "V = a³",
    formulaLabel: "Объём куба",
    given: [{ label: "Сторона a", value: "4 см" }],
    answer: 64,
    unit: "см³",
    hint: "Куб — это фигура, у которой все рёбра одинаковы. Просто возведите сторону в третью степень.",
    explanation: "V = a³ = 4³ = 4 × 4 × 4 = 64 см³",
  },
  {
    id: 2,
    level: 1,
    shape: "Куб",
    shapeIcon: "Box",
    question: "Найдите объём куба, если его ребро равно 7 см.",
    formula: "V = a³",
    formulaLabel: "Объём куба",
    given: [{ label: "Сторона a", value: "7 см" }],
    answer: 343,
    unit: "см³",
    hint: "7³ = 7 × 7 × 7. Сначала найдите 7 × 7, затем умножьте на 7.",
    explanation: "V = 7³ = 7 × 7 × 7 = 49 × 7 = 343 см³",
  },
  {
    id: 3,
    level: 2,
    shape: "Прямоугольный параллелепипед",
    shapeIcon: "RectangleHorizontal",
    question: "Найдите объём прямоугольного параллелепипеда с длиной 6 см, шириной 4 см и высотой 5 см.",
    formula: "V = a · b · h",
    formulaLabel: "Объём параллелепипеда",
    given: [
      { label: "Длина a", value: "6 см" },
      { label: "Ширина b", value: "4 см" },
      { label: "Высота h", value: "5 см" },
    ],
    answer: 120,
    unit: "см³",
    hint: "Перемножьте все три измерения: длину, ширину и высоту.",
    explanation: "V = a · b · h = 6 × 4 × 5 = 120 см³",
  },
  {
    id: 4,
    level: 2,
    shape: "Прямоугольный параллелепипед",
    shapeIcon: "RectangleHorizontal",
    question: "Аквариум имеет форму прямоугольного параллелепипеда: длина 80 см, ширина 30 см, высота 40 см. Найдите его объём в литрах.",
    formula: "V = a · b · h",
    formulaLabel: "Объём параллелепипеда",
    given: [
      { label: "Длина a", value: "80 см" },
      { label: "Ширина b", value: "30 см" },
      { label: "Высота h", value: "40 см" },
    ],
    answer: 96,
    unit: "литров",
    hint: "Сначала найдите объём в см³, затем переведите в литры: 1 литр = 1000 см³.",
    explanation: "V = 80 × 30 × 40 = 96 000 см³ = 96 литров",
  },
  {
    id: 5,
    level: 3,
    shape: "Правильная треугольная призма",
    shapeIcon: "Triangle",
    question: "Основание правильной треугольной призмы — равносторонний треугольник со стороной 6 см. Высота призмы 10 см. Найдите объём.",
    formula: "V = S · h,  S = (a² · √3) / 4",
    formulaLabel: "Объём призмы",
    given: [
      { label: "Сторона основания a", value: "6 см" },
      { label: "Высота призмы h", value: "10 см" },
    ],
    answer: 156,
    unit: "см³",
    hint: "Площадь равностороннего треугольника: S = (a² × √3) / 4 ≈ (36 × 1,732) / 4 ≈ 15,6 см². Умножьте на высоту.",
    explanation: "S = (6² × √3) / 4 = (36 × 1,732) / 4 ≈ 15,6 см²\nV = S × h = 15,6 × 10 = 156 см³",
  },
  {
    id: 6,
    level: 3,
    shape: "Прямая призма",
    shapeIcon: "Triangle",
    question: "В основании прямой призмы лежит прямоугольный треугольник с катетами 3 и 4 см. Высота призмы 12 см. Найдите объём.",
    formula: "V = S · h,  S = (a · b) / 2",
    formulaLabel: "Объём призмы",
    given: [
      { label: "Катет a", value: "3 см" },
      { label: "Катет b", value: "4 см" },
      { label: "Высота h", value: "12 см" },
    ],
    answer: 72,
    unit: "см³",
    hint: "Площадь прямоугольного треугольника равна половине произведения катетов: S = (3 × 4) / 2 = 6 см².",
    explanation: "S = (3 × 4) / 2 = 6 см²\nV = S × h = 6 × 12 = 72 см³",
  },
  {
    id: 7,
    level: 4,
    shape: "Правильная пирамида",
    shapeIcon: "Mountain",
    question: "Найдите объём правильной четырёхугольной пирамиды, если сторона основания 6 см, высота 8 см.",
    formula: "V = (1/3) · S · h",
    formulaLabel: "Объём пирамиды",
    given: [
      { label: "Сторона основания a", value: "6 см" },
      { label: "Высота h", value: "8 см" },
    ],
    answer: 96,
    unit: "см³",
    hint: "Основание — квадрат со стороной 6 см. Площадь основания S = 6² = 36 см². Объём пирамиды в три раза меньше объёма призмы с тем же основанием.",
    explanation: "S = 6² = 36 см²\nV = (1/3) × S × h = (1/3) × 36 × 8 = 96 см³",
  },
  {
    id: 8,
    level: 4,
    shape: "Правильная пирамида",
    shapeIcon: "Mountain",
    question: "Высота правильной треугольной пирамиды равна 9 см, сторона правильного треугольника в основании — 6 см. Найдите объём.",
    formula: "V = (1/3) · S · h",
    formulaLabel: "Объём пирамиды",
    given: [
      { label: "Сторона основания a", value: "6 см" },
      { label: "Высота h", value: "9 см" },
    ],
    answer: 47,
    unit: "см³",
    hint: "S треугольника = (6² × √3) / 4 ≈ 15,6 см². Затем V = (1/3) × S × h. Округлите до целых.",
    explanation: "S = (6² × √3) / 4 ≈ 15,6 см²\nV = (1/3) × 15,6 × 9 = 46,8 ≈ 47 см³",
  },
  {
    id: 9,
    level: 5,
    shape: "Составная фигура",
    shapeIcon: "Layers",
    question: "Фигура состоит из куба со стороной 4 см и пирамиды, стоящей на верхней грани куба. Высота пирамиды 3 см. Найдите суммарный объём фигуры.",
    formula: "V = V куба + V пирамиды",
    formulaLabel: "Суммарный объём",
    given: [
      { label: "Ребро куба a", value: "4 см" },
      { label: "Высота пирамиды h", value: "3 см" },
    ],
    answer: 80,
    unit: "см³",
    hint: "Найдите объём каждой фигуры отдельно, затем сложите. Основание пирамиды — квадрат 4 × 4 см (та же грань, что и у куба).",
    explanation: "V куба = 4³ = 64 см³\nV пирамиды = (1/3) × 4² × 3 = (1/3) × 16 × 3 = 16 см³\nV = 64 + 16 = 80 см³",
  },
  {
    id: 10,
    level: 5,
    shape: "Составная фигура",
    shapeIcon: "Layers",
    question: "Из куба со стороной 10 см вырезали прямоугольный параллелепипед: длина 10 см, ширина 4 см, высота 6 см. Найдите объём оставшейся фигуры.",
    formula: "V = V куба − V выреза",
    formulaLabel: "Оставшийся объём",
    given: [
      { label: "Ребро куба", value: "10 см" },
      { label: "Длина выреза", value: "10 см" },
      { label: "Ширина выреза", value: "4 см" },
      { label: "Высота выреза", value: "6 см" },
    ],
    answer: 760,
    unit: "см³",
    hint: "Найдите объём куба, затем объём вырезанного параллелепипеда. Вычтите второй из первого.",
    explanation: "V куба = 10³ = 1000 см³\nV выреза = 10 × 4 × 6 = 240 см³\nV = 1000 − 240 = 760 см³",
  },
];

const LEVELS = [
  { id: 1, label: "Куб" },
  { id: 2, label: "Параллелепипед" },
  { id: 3, label: "Призма" },
  { id: 4, label: "Пирамида" },
  { id: 5, label: "Составные" },
];

type TaskState = "idle" | "correct" | "wrong";

export default function Index() {
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [input, setInput] = useState("");
  const [taskState, setTaskState] = useState<TaskState>("idle");
  const [showHint, setShowHint] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const task = TASKS[currentTaskIdx];
  const progress = (completed.size / TASKS.length) * 100;

  useEffect(() => {
    setInput("");
    setTaskState("idle");
    setShowHint(false);
    setShowFormula(false);
    setShowExplanation(false);
    setWrongAttempts(0);
    inputRef.current?.focus();
  }, [currentTaskIdx]);

  const handleCheck = () => {
    const userVal = parseFloat(input.replace(",", "."));
    if (isNaN(userVal)) return;

    if (Math.abs(userVal - task.answer) < 0.6) {
      setTaskState("correct");
      setCompleted((prev) => new Set([...prev, task.id]));
      if (completed.size + 1 === TASKS.length) {
        setTimeout(() => setFinished(true), 800);
      }
    } else {
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);
      setTaskState("wrong");
      setShakeKey((k) => k + 1);
      if (attempts >= 2) setShowHint(true);
    }
  };

  const handleNext = () => {
    if (currentTaskIdx < TASKS.length - 1) {
      setCurrentTaskIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentTaskIdx > 0) {
      setCurrentTaskIdx((i) => i - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (taskState === "correct") handleNext();
      else handleCheck();
    }
  };

  const handleRestart = () => {
    setCurrentTaskIdx(0);
    setCompleted(new Set());
    setFinished(false);
    setInput("");
    setTaskState("idle");
  };

  if (finished) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--quest-bg)" }}
      >
        <div className="quest-card quest-fade-in text-center p-16 max-w-md mx-4">
          <div
            className="text-5xl mb-6"
            style={{ color: "var(--quest-success)" }}
          >
            ✓
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--quest-text)" }}
          >
            Квест пройден!
          </h1>
          <p
            className="text-base mb-2"
            style={{ color: "var(--quest-muted)" }}
          >
            Вы решили все {TASKS.length} задач по объёмам многогранников.
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--quest-muted)" }}>
            Отличная работа!
          </p>
          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--quest-accent)",
              color: "#fff",
            }}
          >
            Пройти снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--quest-bg)", fontFamily: "'Golos Text', sans-serif" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          backgroundColor: "var(--quest-surface)",
          borderColor: "var(--quest-border)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--quest-text)" }}>
              Объёмы многогранников
            </span>
            <span className="text-sm" style={{ color: "var(--quest-muted)" }}>
              {completed.size} / {TASKS.length}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          {/* Level tabs */}
          <div className="flex gap-1 mt-3">
            {LEVELS.map((lvl) => {
              const levelTasks = TASKS.filter((t) => t.level === lvl.id);
              const allDone = levelTasks.every((t) => completed.has(t.id));
              const isCurrent = task.level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    const idx = TASKS.findIndex((t) => t.level === lvl.id);
                    if (idx !== -1) setCurrentTaskIdx(idx);
                  }}
                  className="flex-1 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: isCurrent
                      ? "var(--quest-accent-light)"
                      : allDone
                      ? "var(--quest-success-light)"
                      : "transparent",
                    color: isCurrent
                      ? "var(--quest-accent)"
                      : allDone
                      ? "var(--quest-success)"
                      : "var(--quest-muted)",
                    border: isCurrent
                      ? "1px solid var(--quest-accent)"
                      : "1px solid transparent",
                  }}
                >
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
          {/* Task number + shape */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-1 rounded"
              style={{
                backgroundColor: "var(--quest-accent-light)",
                color: "var(--quest-accent)",
              }}
            >
              Задача {task.id}
            </span>
            <span className="text-xs" style={{ color: "var(--quest-muted)" }}>
              {task.shape}
            </span>
            <div className="flex-1" />
            <div className="flex gap-1">
              {TASKS.filter((t) => t.level === task.level).map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setCurrentTaskIdx(TASKS.findIndex((x) => x.id === t.id))
                  }
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: completed.has(t.id)
                      ? "var(--quest-success)"
                      : t.id === task.id
                      ? "var(--quest-accent)"
                      : "var(--quest-border)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="quest-card p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--quest-accent-light)" }}
              >
                <Icon
                  name={task.shapeIcon}
                  size={20}
                  fallback="Box"
                  style={{ color: "var(--quest-accent)" }}
                />
              </div>
              <p
                className="text-base leading-relaxed font-medium"
                style={{ color: "var(--quest-text)" }}
              >
                {task.question}
              </p>
            </div>

            {/* Given values */}
            <div
              className="mt-4 pt-4 border-t flex flex-wrap gap-3"
              style={{ borderColor: "var(--quest-border)" }}
            >
              {task.given.map((g) => (
                <div
                  key={g.label}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-xs" style={{ color: "var(--quest-muted)" }}>
                    {g.label}:
                  </span>
                  <span
                    className="text-sm font-medium font-mono"
                    style={{ color: "var(--quest-text)" }}
                  >
                    {g.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula toggle */}
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="flex items-center gap-2 text-sm transition-all"
            style={{ color: "var(--quest-accent)" }}
          >
            <Icon name={showFormula ? "ChevronDown" : "ChevronRight"} size={14} />
            {showFormula ? "Скрыть формулу" : "Показать формулу"}
          </button>

          {showFormula && (
            <div
              className="quest-card quest-fade-in p-4 flex items-start gap-3"
              style={{ borderColor: "var(--quest-accent)" }}
            >
              <Icon name="BookOpen" size={16} style={{ color: "var(--quest-accent)", marginTop: 2 }} />
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--quest-muted)" }}>
                  {task.formulaLabel}
                </p>
                <p
                  className="text-base font-mono font-medium"
                  style={{ color: "var(--quest-text)" }}
                >
                  {task.formula}
                </p>
              </div>
            </div>
          )}

          {/* Hint */}
          {(showHint || wrongAttempts >= 2) && (
            <div
              className="quest-card quest-fade-in p-4 flex items-start gap-3"
              style={{
                backgroundColor: "var(--quest-hint-light)",
                borderColor: "var(--quest-hint)",
              }}
            >
              <Icon name="Lightbulb" size={16} style={{ color: "var(--quest-hint)", marginTop: 2, flexShrink: 0 }} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--quest-hint)" }}>
                {task.hint}
              </p>
            </div>
          )}

          {!showHint && wrongAttempts < 2 && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-sm transition-all"
              style={{ color: "var(--quest-hint)" }}
            >
              <Icon name="Lightbulb" size={14} />
              Подсказка
            </button>
          )}

          {/* Answer input */}
          <div>
            <label
              className="block text-xs mb-2 font-medium"
              style={{ color: "var(--quest-muted)" }}
            >
              Ваш ответ ({task.unit})
            </label>
            <div key={shakeKey} className={shakeKey > 0 ? "quest-shake" : ""}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="number"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (taskState === "wrong") setTaskState("idle");
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={taskState === "correct"}
                    placeholder="Введите число..."
                    className="w-full px-4 py-3 rounded-lg text-base outline-none transition-all font-mono"
                    style={{
                      border: `1.5px solid ${
                        taskState === "correct"
                          ? "var(--quest-success)"
                          : taskState === "wrong"
                          ? "var(--quest-error)"
                          : "var(--quest-border)"
                      }`,
                      backgroundColor:
                        taskState === "correct"
                          ? "var(--quest-success-light)"
                          : taskState === "wrong"
                          ? "var(--quest-error-light)"
                          : "var(--quest-surface)",
                      color: "var(--quest-text)",
                    }}
                  />
                  {taskState === "correct" && (
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--quest-success)" }}
                    >
                      <Icon name="Check" size={18} />
                    </div>
                  )}
                  {taskState === "wrong" && (
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--quest-error)" }}
                    >
                      <Icon name="X" size={18} />
                    </div>
                  )}
                </div>
                <button
                  onClick={taskState === "correct" ? handleNext : handleCheck}
                  disabled={!input}
                  className="px-5 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                  style={{
                    backgroundColor:
                      taskState === "correct"
                        ? "var(--quest-success)"
                        : "var(--quest-accent)",
                    color: "#fff",
                  }}
                >
                  {taskState === "correct"
                    ? currentTaskIdx < TASKS.length - 1
                      ? "Далее"
                      : "Финиш"
                    : "Проверить"}
                </button>
              </div>
            </div>

            {taskState === "wrong" && (
              <p
                className="text-xs mt-2 quest-fade-in"
                style={{ color: "var(--quest-error)" }}
              >
                Неверно. Попробуйте ещё раз.
                {wrongAttempts >= 2 && " Посмотрите подсказку выше."}
              </p>
            )}

            {taskState === "correct" && (
              <p
                className="text-xs mt-2 quest-fade-in font-medium"
                style={{ color: "var(--quest-success)" }}
              >
                Верно! {task.answer} {task.unit}
              </p>
            )}
          </div>

          {/* Explanation (after correct) */}
          {taskState === "correct" && (
            <div className="quest-fade-in">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--quest-success)" }}
              >
                <Icon name={showExplanation ? "ChevronDown" : "ChevronRight"} size={14} />
                {showExplanation ? "Скрыть решение" : "Посмотреть решение"}
              </button>

              {showExplanation && (
                <div
                  className="quest-card quest-fade-in p-4 mt-2"
                  style={{
                    backgroundColor: "var(--quest-success-light)",
                    borderColor: "var(--quest-success)",
                  }}
                >
                  <p
                    className="text-sm font-mono whitespace-pre-line leading-relaxed"
                    style={{ color: "var(--quest-text)" }}
                  >
                    {task.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: "var(--quest-border)" }}
          >
            <button
              onClick={handlePrev}
              disabled={currentTaskIdx === 0}
              className="flex items-center gap-1.5 text-sm transition-all disabled:opacity-30"
              style={{ color: "var(--quest-muted)" }}
            >
              <Icon name="ArrowLeft" size={14} />
              Назад
            </button>

            <span className="text-xs" style={{ color: "var(--quest-muted)" }}>
              {currentTaskIdx + 1} из {TASKS.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentTaskIdx === TASKS.length - 1}
              className="flex items-center gap-1.5 text-sm transition-all disabled:opacity-30"
              style={{ color: "var(--quest-muted)" }}
            >
              Вперёд
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}