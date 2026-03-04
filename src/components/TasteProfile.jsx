// SVG Radar / Spider Chart for wine tasting profile
// Axes: Sweetness, Acidity, Tannin, Body, Fruitiness

const AXES = [
  { key: 'sweetness',  label: 'Sweetness' },
  { key: 'acidity',    label: 'Acidity' },
  { key: 'tannin',     label: 'Tannin / Bite' },
  { key: 'body',       label: 'Body' },
  { key: 'fruitiness', label: 'Fruitiness' },
]

const MAX = 5
const SIZE = 160
const CX = SIZE / 2
const CY = SIZE / 2
const R = SIZE * 0.38

function polarToXY(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

export default function TasteProfile({ profile, color = '#C9973A', size = 160 }) {
  if (!profile) return null

  const n = AXES.length
  const scale = size / SIZE

  // Build polygon points from values
  const points = AXES.map((axis, i) => {
    const angle = (360 / n) * i
    const value = Math.max(0, Math.min(MAX, profile[axis.key] || 0))
    const r = (value / MAX) * R
    return polarToXY(angle, r)
  })

  const polygonStr = points.map(p => `${p.x * scale},${p.y * scale}`).join(' ')

  // Background grid circles
  const gridLevels = [1, 2, 3, 4, 5]

  // Axis lines
  const axisLines = AXES.map((_, i) => {
    const angle = (360 / n) * i
    const end = polarToXY(angle, R)
    return { x2: end.x * scale, y2: end.y * scale }
  })

  // Axis labels
  const labelPad = 18
  const labels = AXES.map((axis, i) => {
    const angle = (360 / n) * i
    const pos = polarToXY(angle, R + labelPad)
    let anchor = 'middle'
    if (pos.x * scale < (CX * scale) - 10) anchor = 'end'
    if (pos.x * scale > (CX * scale) + 10) anchor = 'start'
    return { x: pos.x * scale, y: pos.y * scale, label: axis.label, anchor }
  })

  const svgSize = size + 60 // extra room for labels

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`-30 -20 ${svgSize} ${svgSize}`}
      aria-label="Wine tasting profile chart"
    >
      {/* Grid */}
      {gridLevels.map(level => {
        const pts = AXES.map((_, i) => {
          const angle = (360 / n) * i
          const pos = polarToXY(angle, (level / MAX) * R)
          return `${pos.x * scale},${pos.y * scale}`
        }).join(' ')
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#E5DDD4"
            strokeWidth="1"
          />
        )
      })}

      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={CX * scale} y1={CY * scale}
          x2={line.x2} y2={line.y2}
          stroke="#E5DDD4"
          strokeWidth="1"
        />
      ))}

      {/* Filled polygon */}
      <polygon
        points={polygonStr}
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x * scale} cy={pt.y * scale}
          r="3.5"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}

      {/* Labels */}
      {labels.map((lbl, i) => (
        <text
          key={i}
          x={lbl.x} y={lbl.y}
          textAnchor={lbl.anchor}
          dominantBaseline="middle"
          fontSize="9"
          fontFamily="DM Sans, system-ui, sans-serif"
          fill="#4A4A60"
          fontWeight="500"
        >
          {lbl.label}
        </text>
      ))}
    </svg>
  )
}
