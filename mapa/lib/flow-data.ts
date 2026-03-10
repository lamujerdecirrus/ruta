export type FlowType = "deposito" | "importacion" | "retiro" | "exportacion"

export interface FlowStep {
  id: string
  type: "status" | "message" | "map" | "decision" | "action"
  content: string
  sender?: "system" | "operator"
  mapType?: "route" | "exit"
  options?: { label: string; nextStep: string }[]
  nextStep?: string
  delay?: number
  routeLabel?: string
}

export interface FlowDefinition {
  id: FlowType
  title: string
  subtitle: string
  icon: string
  color: string
  steps: FlowStep[]
}

export const flowDefinitions: FlowDefinition[] = [
  {
    id: "deposito",
    title: "Deposito de Vacios",
    subtitle: "Contenedores vacios para almacenamiento",
    icon: "container-deposit",
    color: "teal",
    steps: [
      {
        id: "pre-1",
        type: "status",
        content: "Operador registrado en ASLA",
        delay: 800,
        nextStep: "pre-2",
      },
      {
        id: "pre-2",
        type: "status",
        content: "Llamado externo realizado",
        delay: 800,
        nextStep: "pre-3",
      },
      {
        id: "pre-3",
        type: "status",
        content: "Acceso K1 completado",
        delay: 800,
        nextStep: "pre-4",
      },
      {
        id: "pre-4",
        type: "status",
        content: "Acceso K2 completado",
        delay: 800,
        nextStep: "inspection-wait",
      },
      {
        id: "inspection-wait",
        type: "status",
        content: "Esperando en fila de inspeccion...",
        delay: 1200,
        nextStep: "inspection-pass",
      },
      {
        id: "inspection-pass",
        type: "status",
        content: "Paso en zona de inspeccion completado",
        delay: 1000,
        nextStep: "classification",
      },
      {
        id: "classification",
        type: "status",
        content: "Clasificacion y asignacion de carril en nGen",
        delay: 1000,
        nextStep: "wa-route",
      },
      {
        id: "wa-route",
        type: "message",
        sender: "system",
        content: "Hutchison Ports LCT - Sistema de Rutas\n\nOperador, se le ha asignado el carril D-14 para deposito de contenedor vacio.\n\nHaga clic en el enlace para ver su ruta:",
        delay: 500,
        nextStep: "map-route",
      },
      {
        id: "map-route",
        type: "map",
        content: "Ruta hacia Carril D-14 - Zona de Deposito de Vacios",
        mapType: "route",
        routeLabel: "Deposito Vacios - Carril D-14",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        type: "decision",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "wa-route" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        type: "decision",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "map-exit" },
          { label: "No", nextStep: "end" },
        ],
      },
      {
        id: "map-exit",
        type: "map",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "end",
      },
      {
        id: "end",
        type: "status",
        content: "Flujo completado. El operador se dirige a la salida.",
        nextStep: "done",
      },
    ],
  },
  {
    id: "importacion",
    title: "Importacion de Llenos",
    subtitle: "Contenedores llenos para importacion",
    icon: "container-import",
    color: "blue",
    steps: [
      {
        id: "pre-1",
        type: "status",
        content: "Operador registrado en ASLA",
        delay: 800,
        nextStep: "pre-2",
      },
      {
        id: "pre-2",
        type: "status",
        content: "Llamado externo realizado",
        delay: 800,
        nextStep: "pre-3",
      },
      {
        id: "pre-3",
        type: "status",
        content: "Acceso K1 completado",
        delay: 800,
        nextStep: "pre-4",
      },
      {
        id: "pre-4",
        type: "status",
        content: "Acceso K2 completado",
        delay: 800,
        nextStep: "buffer-wait",
      },
      {
        id: "buffer-wait",
        type: "status",
        content: "Esperando en buffer...",
        delay: 1500,
        nextStep: "internal-call",
      },
      {
        id: "internal-call",
        type: "status",
        content: "Llamado interno recibido",
        delay: 1000,
        nextStep: "wa-route",
      },
      {
        id: "wa-route",
        type: "message",
        sender: "system",
        content: "Hutchison Ports LCT - Sistema de Rutas\n\nOperador, tiene un llamado interno.\nDirijase a la grua G-07 para carga de contenedor de importacion.\n\nHaga clic en el enlace para ver su ruta:",
        delay: 500,
        nextStep: "map-route",
      },
      {
        id: "map-route",
        type: "map",
        content: "Ruta hacia Grua G-07 - Zona de Importacion",
        mapType: "route",
        routeLabel: "Importacion Llenos - Grua G-07",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        type: "decision",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "wa-route" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        type: "decision",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "map-exit" },
          { label: "No", nextStep: "end" },
        ],
      },
      {
        id: "map-exit",
        type: "map",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "end",
      },
      {
        id: "end",
        type: "status",
        content: "Flujo completado. El operador se dirige a la salida.",
        nextStep: "done",
      },
    ],
  },
  {
    id: "retiro",
    title: "Retiro de Vacio",
    subtitle: "Retiro de contenedores vacios",
    icon: "container-withdrawal",
    color: "amber",
    steps: [
      {
        id: "pre-1",
        type: "status",
        content: "Operador registrado en ASLA",
        delay: 800,
        nextStep: "pre-2",
      },
      {
        id: "pre-2",
        type: "status",
        content: "Llamado externo realizado",
        delay: 800,
        nextStep: "pre-3",
      },
      {
        id: "pre-3",
        type: "status",
        content: "Acceso K1 completado",
        delay: 800,
        nextStep: "pre-4",
      },
      {
        id: "pre-4",
        type: "status",
        content: "Acceso K2 completado",
        delay: 800,
        nextStep: "wa-route",
      },
      {
        id: "wa-route",
        type: "message",
        sender: "system",
        content: "Hutchison Ports LCT - Sistema de Rutas\n\nOperador, se le ha asignado el area B-22 para retiro de contenedor vacio.\n\nHaga clic en el enlace para ver su ruta:",
        delay: 500,
        nextStep: "map-route",
      },
      {
        id: "map-route",
        type: "map",
        content: "Ruta hacia Area B-22 - Zona de Retiro de Vacios",
        mapType: "route",
        routeLabel: "Retiro Vacio - Area B-22",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        type: "decision",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "wa-route" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        type: "decision",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "map-exit" },
          { label: "No", nextStep: "end" },
        ],
      },
      {
        id: "map-exit",
        type: "map",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "end",
      },
      {
        id: "end",
        type: "status",
        content: "Flujo completado. El operador se dirige a la salida.",
        nextStep: "done",
      },
    ],
  },
  {
    id: "exportacion",
    title: "Exportacion de Llenos",
    subtitle: "Contenedores llenos para exportacion",
    icon: "container-export",
    color: "rose",
    steps: [
      {
        id: "pre-1",
        type: "status",
        content: "Operador registrado en ASLA",
        delay: 800,
        nextStep: "pre-2",
      },
      {
        id: "pre-2",
        type: "status",
        content: "Llamado externo realizado",
        delay: 800,
        nextStep: "pre-3",
      },
      {
        id: "pre-3",
        type: "status",
        content: "Acceso K1 completado",
        delay: 800,
        nextStep: "pre-4",
      },
      {
        id: "pre-4",
        type: "status",
        content: "Acceso K2 completado",
        delay: 800,
        nextStep: "wa-route",
      },
      {
        id: "wa-route",
        type: "message",
        sender: "system",
        content: "Hutchison Ports LCT - Sistema de Rutas\n\nOperador, dirijase al muelle E-03 para entrega de contenedor de exportacion.\n\nHaga clic en el enlace para ver su ruta:",
        delay: 500,
        nextStep: "map-route",
      },
      {
        id: "map-route",
        type: "map",
        content: "Ruta hacia Muelle E-03 - Zona de Exportacion",
        mapType: "route",
        routeLabel: "Exportacion Llenos - Muelle E-03",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        type: "decision",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "wa-route" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        type: "decision",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "map-exit" },
          { label: "No", nextStep: "end" },
        ],
      },
      {
        id: "map-exit",
        type: "map",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "end",
      },
      {
        id: "end",
        type: "status",
        content: "Flujo completado. El operador se dirige a la salida.",
        nextStep: "done",
      },
    ],
  },
]
