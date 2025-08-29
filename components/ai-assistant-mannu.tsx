"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Brain,
  Heart,
  Lightbulb,
  Calendar,
  Activity,
  Globe,
  Phone,
  Video,
  AlertCircle,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface Language {
  code: string
  name: string
  flag: string
  speechCode: string
}

interface MannuAssistantProps {
  currentStep?: number
  isFixed?: boolean
  onClose?: () => void
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", speechCode: "en-US" },
  { code: "es", name: "Español", flag: "🇪🇸", speechCode: "es-ES" },
  { code: "fr", name: "Français", flag: "🇫🇷", speechCode: "fr-FR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", speechCode: "de-DE" },
  { code: "it", name: "Italiano", flag: "🇮🇹", speechCode: "it-IT" },
  { code: "pt", name: "Português", flag: "🇵🇹", speechCode: "pt-PT" },
  { code: "zh", name: "中文", flag: "🇨🇳", speechCode: "zh-CN" },
  { code: "ja", name: "日本語", flag: "🇯🇵", speechCode: "ja-JP" },
  { code: "ko", name: "한국어", flag: "🇰🇷", speechCode: "ko-KR" },
  { code: "ar", name: "العربية", flag: "🇸🇦", speechCode: "ar-SA" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", speechCode: "hi-IN" },
  { code: "ru", name: "Русский", flag: "🇷🇺", speechCode: "ru-RU" },
]

const translations = {
  en: {
    greeting:
      "Hello! I'm Mannu, your AI health companion. I'm here to help you with your cognitive assessment and answer questions about brain health. You can speak to me or type messages. How can I assist you today?",
    help: "I'm here to help! I can explain how cognitive tests work, provide encouragement, answer brain health questions, schedule consultations, or chat to keep you comfortable. What do you need help with?",
    assessment:
      "This comprehensive assessment evaluates memory, attention, processing speed, and executive function. Each test is scientifically designed and validated. Don't worry about perfect performance - just do your best!",
    time: "The complete assessment takes 20-25 minutes. You can take breaks between sections if needed. Focus on doing your best rather than rushing.",
    nervous:
      "It's completely normal to feel nervous! This assessment is designed to help, not judge. Take deep breaths, relax, and remember I'm here to support you. You're doing great!",
    brainTips: [
      "Regular exercise increases blood flow to the brain and promotes new neural connections.",
      "Getting 7-9 hours of quality sleep helps consolidate memories and clear brain toxins.",
      "Eating foods rich in omega-3 fatty acids, like fish and nuts, supports brain health.",
      "Learning new skills or languages creates new neural pathways and keeps your brain active.",
      "Social connections and meaningful relationships are crucial for cognitive health.",
      "Meditation and mindfulness practices can improve focus and reduce stress on the brain.",
    ],
    encouragement: [
      "You're doing wonderfully! Every step you take in this assessment is valuable.",
      "I believe in you! Your brain is amazing and capable of great things.",
      "Remember, this isn't about being perfect - it's about understanding your cognitive strengths.",
      "You've got this! Take your time and trust in your abilities.",
      "I'm proud of you for taking this important step in understanding your brain health.",
    ],
    schedule:
      "I can help you schedule a consultation with our healthcare professionals. What type of appointment would you like?",
    consultationScheduled:
      "Excellent! I've scheduled your consultation. You'll receive a confirmation email with all the details shortly. Is there anything else I can help you with?",
  },
  es: {
    greeting:
      "¡Hola! Soy Mannu, tu compañero de salud con IA. Estoy aquí para ayudarte con tu evaluación cognitiva y responder preguntas sobre la salud cerebral. Puedes hablarme o escribir mensajes. ¿Cómo puedo ayudarte hoy?",
    help: "¡Estoy aquí para ayudar! Puedo explicar cómo funcionan las pruebas cognitivas, brindar aliento, responder preguntas sobre la salud cerebral, programar consultas o charlar para mantenerte cómodo. ¿En qué necesitas ayuda?",
    assessment:
      "Esta evaluación integral evalúa memoria, atención, velocidad de procesamiento y función ejecutiva. Cada prueba está científicamente diseñada y validada. ¡No te preocupes por el rendimiento perfecto, solo haz tu mejor esfuerzo!",
    time: "La evaluación completa toma 20-25 minutos. Puedes tomar descansos entre secciones si es necesario. Enfócate en hacer tu mejor esfuerzo en lugar de apresurarte.",
    nervous:
      "¡Es completamente normal sentirse nervioso! Esta evaluación está diseñada para ayudar, no para juzgar. Respira profundo, relájate y recuerda que estoy aquí para apoyarte. ¡Lo estás haciendo genial!",
    brainTips: [
      "El ejercicio regular aumenta el flujo sanguíneo al cerebro y promueve nuevas conexiones neuronales.",
      "Dormir 7-9 horas de calidad ayuda a consolidar memorias y limpiar toxinas cerebrales.",
      "Comer alimentos ricos en ácidos grasos omega-3, como pescado y nueces, apoya la salud cerebral.",
    ],
    encouragement: [
      "¡Lo estás haciendo maravillosamente! Cada paso que das en esta evaluación es valioso.",
      "¡Creo en ti! Tu cerebro es increíble y capaz de grandes cosas.",
      "Recuerda, esto no se trata de ser perfecto - se trata de entender tus fortalezas cognitivas.",
    ],
    schedule:
      "Puedo ayudarte a programar una consulta con nuestros profesionales de la salud. ¿Qué tipo de cita te gustaría?",
    consultationScheduled:
      "¡Excelente! He programado tu consulta. Recibirás un email de confirmación con todos los detalles pronto. ¿Hay algo más en lo que pueda ayudarte?",
  },
  zh: {
    greeting:
      "你好！我是Mannu，你的AI健康伙伴。我在这里帮助你进行认知评估并回答有关大脑健康的问题。你可以对我说话或输入消息。今天我能如何帮助你？",
    help: "我在这里帮助你！我可以解释认知测试如何工作，提供鼓励，回答大脑健康问题，安排咨询，或聊天让你感到舒适。你需要什么帮助？",
    assessment:
      "这个综合评估评估记忆、注意力、处理速度和执行功能。每个测试都是科学设计和验证的。不要担心完美的表现 - 只要尽力而为！",
    time: "完整的评估需要20-25分钟。如果需要，你可以在各部分之间休息。专注于尽力而为而不是匆忙。",
    nervous: "感到紧张是完全正常的！这个评估是为了帮助，而不是评判。深呼吸，放松，记住我在这里支持你。你做得很好！",
    brainTips: [
      "定期锻炼增加大脑血流量并促进新的神经连接。",
      "获得7-9小时的优质睡眠有助于巩固记忆和清除大脑毒素。",
      "吃富含omega-3脂肪酸的食物，如鱼和坚果，支持大脑健康。",
    ],
    encouragement: [
      "你做得很棒！你在这个评估中迈出的每一步都是有价值的。",
      "我相信你！你的大脑很棒，能够做伟大的事情。",
      "记住，这不是关于完美 - 这是关于了解你的认知优势。",
    ],
    schedule: "我可以帮你安排与我们医疗专业人员的咨询。你想要什么类型的预约？",
    consultationScheduled:
      "太好了！我已经安排了你的咨询。你很快就会收到包含所有详细信息的确认邮件。还有什么我可以帮助你的吗？",
  },
  hi: {
    greeting:
      "नमस्ते! मैं मन्नू हूं, आपका AI स्वास्थ्य साथी। मैं यहां आपके संज्ञानात्मक मूल्यांकन में मदद करने और मस्तिष्क स्वास्थ्य के बारे में प्रश्नों के उत्तर देने के लिए हूं। आप मुझसे बात कर सकते हैं या संदेश टाइप कर सकते हैं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    help: "मैं मदद के लिए यहां हूं! मैं समझा सकता हूं कि संज्ञानात्मक परीक्षण कैसे काम करते हैं, प्रोत्साहन प्रदान कर सकता हूं, मस्तिष्क स्वास्थ्य के प्रश्नों के उत्तर दे सकता हूं, परामर्श शेड्यूल कर सकता हूं, या आपको आरामदायक रखने के लिए चैट कर सकता हूं। आपको किस चीज़ में मदद चाहिए?",
    assessment:
      "यह व्यापक मूल्यांकन स्मृति, ध्यान, प्रसंस्करण गति और कार्यकारी कार्य का मूल्यांकन करता है। प्रत्येक परीक्षण वैज्ञानिक रूप से डिज़ाइन और सत्यापित है। पूर्ण प्रदर्शन की चिंता न करें - बस अपना सर्वश्रेष्ठ करें!",
    time: "पूर्ण मूल्यांकन 20-25 मिनट लेता है। यदि आवश्यक हो तो आप अनुभागों के बीच ब्रेक ले सकते हैं। जल्दबाजी के बजाय अपना सर्वश्रेष्ठ करने पर ध्यान दें।",
    nervous:
      "घबराना बिल्कुल सामान्य है! यह मूल्यांकन मदद करने के लिए डिज़ाइन किया गया है, न्याय करने के लिए नहीं। गहरी सांस लें, आराम करें, और याद रखें कि मैं यहां आपका समर्थन करने के लिए हूं। आप बहुत अच्छा कर रहे हैं!",
    brainTips: [
      "नियमित व्यायाम मस्तिष्क में रक्त प्रवाह बढ़ाता है और नए तंत्रिका कनेक्शन को बढ़ावा देता है।",
      "7-9 घंटे की गुणवत्तापूर्ण नींद यादों को मजबूत बनाने और मस्तिष्क के विषाक्त पदार्थों को साफ करने में मदद करती है।",
      "ओमेगा-3 फैटी एसिड से भरपूर खाद्य पदार्थ खाना, जैसे मछली और नट्स, मस्तिष्क स्वास्थ्य का समर्थन करता है।",
    ],
    encouragement: [
      "आप अद्भुत काम कर रहे हैं! इस मूल्यांकन में आपका हर कदम मूल्यवान है।",
      "मैं आप पर विश्वास करता हूं! आपका मस्तिष्क अद्भुत है और महान चीजों में सक्षम है।",
      "याद रखें, यह पूर्ण होने के बारे में नहीं है - यह आपकी संज्ञानात्मक शक्तियों को समझने के बारे में है।",
    ],
    schedule: "मैं आपको हमारे स्वास्थ्य पेशेवरों के साथ परामर्श शेड्यूल करने में मदद कर सकता हूं। आप किस प्रकार की नियुक्ति चाहेंगे?",
    consultationScheduled:
      "बहुत बढ़िया! मैंने आपका परामर्श शेड्यूल कर दिया है। आपको जल्द ही सभी विवरणों के साथ एक पुष्टिकरण ईमेल प्राप्त होगा। क्या कुछ और है जिसमें मैं आपकी मदद कर सकता हूं?",
  },
}

export function MannuAssistant({ currentStep = 0, isFixed = false, onClose }: MannuAssistantProps) {
  const [isOpen, setIsOpen] = useState(!isFixed)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState("")

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with greeting message
  useEffect(() => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: t.greeting,
        timestamp: new Date(),
      },
    ])
  }, [currentLanguage])

  // Initialize speech recognition and synthesis with better error handling
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.maxAlternatives = 3
      recognitionRef.current.lang = currentLanguage.speechCode

      recognitionRef.current.onstart = () => {
        setAudioError(null)
        setInterimTranscript("")
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setInterimTranscript(interimTranscript)

        if (finalTranscript) {
          handleUserMessage(finalTranscript.trim(), true)
          setInterimTranscript("")
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setInterimTranscript("")

        let errorMessage = "Audio recognition error. "
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech detected. Please try speaking clearly."
            break
          case "audio-capture":
            errorMessage += "Microphone not accessible. Please check permissions."
            break
          case "not-allowed":
            errorMessage += "Microphone permission denied. Please allow microphone access."
            break
          case "network":
            errorMessage += "Network error. Please check your connection."
            break
          default:
            errorMessage += "Please try again or use text input."
        }
        setAudioError(errorMessage)
      }
    } else {
      setAudioError("Speech recognition not supported in this browser. Please use text input.")
    }

    synthRef.current = window.speechSynthesis
  }, [currentLanguage])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleUserMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
      isVoice,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setShowScheduleOptions(false)
    setAudioError(null)

    // Simulate AI response delay
    setTimeout(
      () => {
        const response = generateMannuResponse(content.trim(), currentStep, currentLanguage.code)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)

        // Show schedule options if user asked about scheduling
        if (
          content.toLowerCase().includes("schedule") ||
          content.toLowerCase().includes("appointment") ||
          content.toLowerCase().includes("consultation") ||
          content.toLowerCase().includes("doctor") ||
          content.toLowerCase().includes("meeting")
        ) {
          setShowScheduleOptions(true)
        }

        // Auto-speak response if user used voice
        if (isVoice) {
          speakMessage(response)
        }
      },
      800 + Math.random() * 800,
    )
  }

  const generateMannuResponse = (userInput: string, step: number, langCode: string): string => {
    const input = userInput.toLowerCase().trim()
    const t = translations[langCode as keyof typeof translations] || translations.en

    // Context-aware responses based on assessment step
    const stepContexts = {
      0: "Since you're starting your assessment, ",
      1: "During the voice analysis phase, ",
      2: "For the memory matching game, ",
      3: "In the attention focus test, ",
      4: "For the processing speed assessment, ",
      5: "During spatial reasoning, ",
      6: "In the working memory test, ",
      7: "For number sequences, ",
      8: "During word recall, ",
      9: "In the trail making test, ",
      10: "For clock drawing, ",
      11: "During verbal fluency, ",
      12: "In the MMSE screening, ",
    }

    // More comprehensive keyword matching
    const greetingWords = [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "hola",
      "你好",
      "नमस्ते",
      "bonjour",
      "guten tag",
      "ciao",
      "olá",
    ]
    const helpWords = [
      "help",
      "assist",
      "support",
      "guide",
      "explain",
      "ayuda",
      "帮助",
      "मदद",
      "aide",
      "hilfe",
      "aiuto",
      "ajuda",
    ]
    const testWords = [
      "test",
      "assessment",
      "exam",
      "evaluation",
      "screening",
      "prueba",
      "测试",
      "परीक्षण",
      "test",
      "prüfung",
      "esame",
      "teste",
    ]
    const timeWords = [
      "time",
      "long",
      "duration",
      "how much",
      "minutes",
      "hours",
      "tiempo",
      "时间",
      "समय",
      "temps",
      "zeit",
      "tempo",
      "tempo",
    ]
    const nervousWords = [
      "nervous",
      "anxious",
      "worried",
      "scared",
      "afraid",
      "nervioso",
      "紧张",
      "घबराना",
      "nerveux",
      "nervös",
      "nervoso",
      "nervoso",
    ]
    const brainWords = [
      "brain",
      "health",
      "tips",
      "improve",
      "memory",
      "cerebro",
      "大脑",
      "मस्तिष्क",
      "cerveau",
      "gehirn",
      "cervello",
      "cérebro",
    ]
    const encourageWords = [
      "encourage",
      "motivation",
      "confidence",
      "support",
      "boost",
      "ánimo",
      "鼓励",
      "प्रोत्साहन",
      "encouragement",
      "ermutigung",
      "incoraggiamento",
      "encorajamento",
    ]
    const scheduleWords = [
      "schedule",
      "appointment",
      "consultation",
      "doctor",
      "meeting",
      "book",
      "cita",
      "预约",
      "नियुक्ति",
      "rendez-vous",
      "termin",
      "appuntamento",
      "consulta",
    ]

    // Check for greeting
    if (greetingWords.some((word) => input.includes(word))) {
      return `Hello! I'm Mannu, your friendly AI health assistant. ${stepContexts[step as keyof typeof stepContexts] || ""}I'm here to guide you through your cognitive assessment and answer any questions. What would you like to know?`
    }

    // Check for help requests
    if (helpWords.some((word) => input.includes(word))) {
      return t.help
    }

    // Check for assessment questions
    if (testWords.some((word) => input.includes(word))) {
      return `${stepContexts[step as keyof typeof stepContexts] || ""}${t.assessment}`
    }

    // Check for time questions
    if (timeWords.some((word) => input.includes(word))) {
      return t.time
    }

    // Check for nervousness
    if (nervousWords.some((word) => input.includes(word))) {
      return t.nervous
    }

    // Check for brain health tips
    if (brainWords.some((word) => input.includes(word))) {
      const randomTip = t.brainTips[Math.floor(Math.random() * t.brainTips.length)]
      return `Here's a great brain health tip: ${randomTip} Would you like to know more about maintaining cognitive wellness?`
    }

    // Check for encouragement
    if (encourageWords.some((word) => input.includes(word))) {
      const randomEncouragement = t.encouragement[Math.floor(Math.random() * t.encouragement.length)]
      return `${randomEncouragement} ${stepContexts[step as keyof typeof stepContexts] || ""}Keep going - you're making excellent progress!`
    }

    // Check for scheduling
    if (scheduleWords.some((word) => input.includes(word))) {
      return t.schedule
    }

    // Specific responses for common questions
    if (input.includes("what") && input.includes("name")) {
      return "I'm Mannu, your AI health companion! I'm here to help you with your cognitive assessment and provide support throughout the process."
    }

    if (input.includes("how") && (input.includes("work") || input.includes("function"))) {
      return `${stepContexts[step as keyof typeof stepContexts] || ""}Each test in our assessment is scientifically designed to measure specific cognitive functions. The AI analyzes your responses, reaction times, and patterns to provide insights into your brain health. Everything is secure and private!`
    }

    if (input.includes("result") || input.includes("score") || input.includes("report")) {
      return `After completing all tests, you'll receive a comprehensive report showing your cognitive strengths and areas for attention. ${stepContexts[step as keyof typeof stepContexts] || ""}The results include personalized recommendations and, if needed, suggestions for follow-up care.`
    }

    // Default contextual responses
    const defaultResponses = [
      `That's an interesting question! ${stepContexts[step as keyof typeof stepContexts] || ""}Let me help you with that. Could you tell me more about what you'd like to know?`,
      `I appreciate you sharing that with me. ${stepContexts[step as keyof typeof stepContexts] || ""}How can I best support you right now?`,
      `Thanks for talking with me! ${stepContexts[step as keyof typeof stepContexts] || ""}I'm here to make this experience as comfortable as possible. What's on your mind?`,
      `I'm listening and here to help! ${stepContexts[step as keyof typeof stepContexts] || ""}Feel free to ask me anything about the assessment or brain health in general.`,
      `That's a great point! ${stepContexts[step as keyof typeof stepContexts] || ""}I want to make sure you feel supported throughout this process. How are you feeling so far?`,
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleScheduleConsultation = (type: string) => {
    const t = translations[currentLanguage.code as keyof typeof translations] || translations.en

    // Simulate scheduling
    const appointmentDate = new Date()
    appointmentDate.setDate(appointmentDate.getDate() + 7) // Schedule for next week

    const consultationMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: "assistant",
      content: `${t.consultationScheduled} Your ${type} consultation is scheduled for ${appointmentDate.toLocaleDateString()} at 2:00 PM.`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, consultationMessage])
    setShowScheduleOptions(false)

    // In a real implementation, this would integrate with a scheduling system
    console.log(`Scheduling ${type} consultation for ${appointmentDate}`)
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setAudioError(null)
      recognitionRef.current.lang = currentLanguage.speechCode
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
        setIsListening(false)
        setAudioError("Could not start audio recognition. Please try again.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript("")
    }
  }

  const speakMessage = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = currentLanguage.speechCode
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = () => {
    handleUserMessage(inputMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Fixed positioning for the assistant
  const containerClasses = isFixed ? "fixed bottom-4 right-4 z-50 w-96 max-h-[600px]" : "w-full max-w-md mx-auto"

  return (
    <div className={containerClasses}>
      {/* Floating Action Button */}
      {isFixed && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110 group fixed bottom-4 right-4 z-50"
        >
          <div className="relative">
            <Bot className="h-7 w-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        </Button>
      )}

      {/* Main Assistant Panel */}
      {(!isFixed || isOpen) && (
        <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10 fixed bottom-4 right-4 z-50 w-96 max-h-[600px]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 border-2 border-purple-500/30">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg">
                    M
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white text-xl flex items-center">
                    Mannu
                    <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </CardTitle>
                  <p className="text-purple-300 text-sm">Your AI Health Companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isFixed && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false)
                        onClose?.()
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 mt-4">
              <Globe className="h-4 w-4 text-purple-400" />
              <Select
                value={currentLanguage.code}
                onValueChange={(value) => {
                  const lang = languages.find((l) => l.code === value) || languages[0]
                  setCurrentLanguage(lang)
                  setAudioError(null)
                }}
              >
                <SelectTrigger className="w-full bg-gray-800/50 border-purple-500/20 text-white">
                  <SelectValue>
                    <span className="flex items-center space-x-2">
                      <span>{currentLanguage.flag}</span>
                      <span>{currentLanguage.name}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/20">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="space-y-4">
              {/* Audio Error Display */}
              {audioError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{audioError}</p>
                </div>
              )}

              {/* Messages Area */}
              <ScrollArea className="h-80 w-full pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.isVoice && (
                            <div className="flex items-center space-x-1">
                              <Mic className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">Voice</span>
                            </div>
                          )}
                          {message.type === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(message.content)}
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Interim Transcript Display */}
                  {interimTranscript && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-200">
                        <p className="text-sm leading-relaxed italic">{interimTranscript}</p>
                        <span className="text-xs opacity-70">Listening...</span>
                      </div>
                    </div>
                  )}

                  {/* Schedule Options */}
                  {showScheduleOptions && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30 rounded-2xl p-4 max-w-[80%]">
                        <p className="text-sm mb-3">Choose consultation type:</p>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("Phone Consultation")}
                            className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Phone Consultation
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("Video Consultation")}
                            className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Video Consultation
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleScheduleConsultation("In-Person Visit")}
                            className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            In-Person Visit
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 border border-gray-600/30 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-sm text-purple-300">Mannu is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Voice Controls */}
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex-1 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                  disabled={!!audioError}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Chat
                    </>
                  )}
                </Button>

                <Button
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  variant="outline"
                  className="bg-transparent border-purple-500/20 text-white hover:bg-purple-500/10"
                  disabled={!isSpeaking}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Voice Status */}
              {isListening && (
                <div className="flex items-center justify-center space-x-2 text-red-400 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Listening... Speak clearly</span>
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
              )}

              {/* Text Input */}
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to Mannu..."
                  className="flex-1 bg-gray-800/50 border-gray-600/30 text-white placeholder-gray-400 focus:border-purple-500/50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("I need help with this test")}
                  className="bg-transparent border-blue-500/20 text-blue-300 hover:bg-blue-500/10 text-xs"
                >
                  <Lightbulb className="mr-1 h-3 w-3" />
                  Need Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Give me encouragement")}
                  className="bg-transparent border-green-500/20 text-green-300 hover:bg-green-500/10 text-xs"
                >
                  <Heart className="mr-1 h-3 w-3" />
                  Encourage Me
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Tell me about brain health")}
                  className="bg-transparent border-purple-500/20 text-purple-300 hover:bg-purple-500/10 text-xs"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  Brain Tips
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUserMessage("Schedule appointment")}
                  className="bg-transparent border-orange-500/20 text-orange-300 hover:bg-orange-500/10 text-xs"
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  Schedule
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-xs">Mannu AI - Enhanced Audio & Multilingual Support</span>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
