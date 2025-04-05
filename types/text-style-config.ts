export interface TextContainer {
  id: string
  text: string
  fontFamily: string
  fontSize: number // Will be displayed in rem
  textColor: string
  textColorDark: string // New property for dark mode
  fontWeight: string | number // New property for font weight
  marginTop: number
  marginBottom: number
  delay: number // Animation delay for this container
}

export type StaggerType = "none" | "letter" | "word" | "line"

export interface TextStyleConfig {
  backgroundColor: string
  backgroundColorDark: string // New property for dark mode
  borderRadius: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  textContainers: TextContainer[]
  animation: {
    initialX: number
    initialY: number
    initialOpacity: number
    initialBlur: number
    initialRotation: number
    duration: number
    type: "tween" | "spring"
    ease: string
    stiffness: number
    damping: number
    mass: number
    animateCard: boolean
    stagger: {
      enabled: boolean
      type: StaggerType
      amount: number // Delay between each staggered element in seconds
    }
  }
}

