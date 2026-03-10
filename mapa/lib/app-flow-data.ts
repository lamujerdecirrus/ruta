export type AppFlowType = "deposito" | "importacion" | "retiro" | "exportacion"

export type AppScreen =
  | "splash"
  | "login-or-register"
  | "login-phone"
  | "login-password"
  | "login-error"
  | "login-keep-session"
  | "register-phone"
  | "register-password"
  | "register-invalid"
  | "register-code-sent"
  | "register-verify"
  | "register-code-error"
  | "register-success"
  | "welcome"
  | "operation-home"
  | "route-inspection"
  | "route-map"
  | "buffer-wait"
  | "internal-call"
  | "route-assignment"
  | "route-map-main"
  | "decision-another"
  | "decision-exit"
  | "route-map-exit"
  | "flow-done"

export interface AppFlowDefinition {
  id: AppFlowType
  title: string
  subtitle: string
  icon: string
  color: string
  operatorName: string
  /** Specific steps after login, describing the in-app operation */
  operationSteps: OperationStep[]
}

export interface OperationStep {
  id: string
  screen: AppScreen
  content: string
  mapType?: "route" | "exit" | "buffer"
  routeLabel?: string
  nextStep?: string
  delay?: number
  options?: { label: string; nextStep: string }[]
}

export const appFlowDefinitions: AppFlowDefinition[] = [
  {
    id: "deposito",
    title: "Deposito de Vacios",
    subtitle: "Contenedores vacios para almacenamiento",
    icon: "container-deposit",
    color: "teal",
    operatorName: "Carlos Martinez",
    operationSteps: [
      {
        id: "route-inspection",
        screen: "route-inspection",
        content: "Dirigete a la fila de la zona de inspeccion",
        nextStep: "route-map-inspect",
        delay: 1200,
      },
      {
        id: "route-map-inspect",
        screen: "route-map",
        content: "Ruta a zona de inspeccion",
        mapType: "route",
        routeLabel: "Zona de Inspeccion - Deposito Vacios",
        nextStep: "route-assignment",
      },
      {
        id: "route-assignment",
        screen: "route-assignment",
        content: "Se le ha asignado el carril D-14 para deposito de contenedor vacio.",
        nextStep: "route-map-main",
        delay: 1000,
      },
      {
        id: "route-map-main",
        screen: "route-map-main",
        content: "Ruta hacia Carril D-14",
        mapType: "route",
        routeLabel: "Deposito Vacios - Carril D-14",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        screen: "decision-another",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "route-assignment" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        screen: "decision-exit",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "route-map-exit" },
          { label: "No", nextStep: "flow-done" },
        ],
      },
      {
        id: "route-map-exit",
        screen: "route-map-exit",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "flow-done",
      },
      {
        id: "flow-done",
        screen: "flow-done",
        content: "Flujo completado. El operador se dirige a la salida.",
      },
    ],
  },
  {
    id: "importacion",
    title: "Importacion de Llenos",
    subtitle: "Contenedores llenos para importacion",
    icon: "container-import",
    color: "blue",
    operatorName: "Jorge Ramirez",
    operationSteps: [
      {
        id: "buffer-wait",
        screen: "buffer-wait",
        content: "Mostrando buffer en el mapa. Espera tu llamado interno.",
        mapType: "buffer",
        routeLabel: "Zona de Buffer - Espera",
        nextStep: "internal-call",
        delay: 2000,
      },
      {
        id: "internal-call",
        screen: "internal-call",
        content: "Llamado interno recibido. Dirigete a la Grua G-07.",
        nextStep: "route-map-main",
        delay: 1200,
      },
      {
        id: "route-map-main",
        screen: "route-map-main",
        content: "Ruta hacia Grua G-07 - Importacion",
        mapType: "route",
        routeLabel: "Importacion Llenos - Grua G-07",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        screen: "decision-another",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "buffer-wait" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        screen: "decision-exit",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "route-map-exit" },
          { label: "No", nextStep: "flow-done" },
        ],
      },
      {
        id: "route-map-exit",
        screen: "route-map-exit",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "flow-done",
      },
      {
        id: "flow-done",
        screen: "flow-done",
        content: "Flujo completado. El operador se dirige a la salida.",
      },
    ],
  },
  {
    id: "retiro",
    title: "Retiro de Vacio",
    subtitle: "Retiro de contenedores vacios",
    icon: "container-withdrawal",
    color: "amber",
    operatorName: "Luis Hernandez",
    operationSteps: [
      {
        id: "route-assignment",
        screen: "route-assignment",
        content: "Se le ha asignado el area B-22 para retiro de contenedor vacio.",
        nextStep: "route-map-main",
        delay: 1000,
      },
      {
        id: "route-map-main",
        screen: "route-map-main",
        content: "Ruta hacia Area B-22",
        mapType: "route",
        routeLabel: "Retiro Vacio - Area B-22",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        screen: "decision-another",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "route-assignment" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        screen: "decision-exit",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "route-map-exit" },
          { label: "No", nextStep: "flow-done" },
        ],
      },
      {
        id: "route-map-exit",
        screen: "route-map-exit",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "flow-done",
      },
      {
        id: "flow-done",
        screen: "flow-done",
        content: "Flujo completado. El operador se dirige a la salida.",
      },
    ],
  },
  {
    id: "exportacion",
    title: "Exportacion de Llenos",
    subtitle: "Contenedores llenos para exportacion",
    icon: "container-export",
    color: "rose",
    operatorName: "Miguel Torres",
    operationSteps: [
      {
        id: "route-assignment",
        screen: "route-assignment",
        content: "Se le ha asignado el Muelle E-03 para exportacion de contenedor lleno.",
        nextStep: "route-map-main",
        delay: 1000,
      },
      {
        id: "route-map-main",
        screen: "route-map-main",
        content: "Ruta hacia Muelle E-03 - Exportacion",
        mapType: "route",
        routeLabel: "Exportacion Llenos - Muelle E-03",
        nextStep: "decision-another",
      },
      {
        id: "decision-another",
        screen: "decision-another",
        content: "Hay otro contenedor?",
        options: [
          { label: "Si, otro contenedor", nextStep: "route-assignment" },
          { label: "No, es el ultimo", nextStep: "decision-exit" },
        ],
      },
      {
        id: "decision-exit",
        screen: "decision-exit",
        content: "Mostrar ruta de salida?",
        options: [
          { label: "Si, mostrar salida", nextStep: "route-map-exit" },
          { label: "No", nextStep: "flow-done" },
        ],
      },
      {
        id: "route-map-exit",
        screen: "route-map-exit",
        content: "Ruta de salida del patio",
        mapType: "exit",
        routeLabel: "Salida del Patio",
        nextStep: "flow-done",
      },
      {
        id: "flow-done",
        screen: "flow-done",
        content: "Flujo completado. El operador se dirige a la salida.",
      },
    ],
  },
]
