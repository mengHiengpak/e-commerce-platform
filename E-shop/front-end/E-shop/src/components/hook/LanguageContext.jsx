import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../languages/Languages'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key, vars = {}) => {
    let text = translations[language]?.[key] || translations.en[key] || key
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage() {
  return useContext(LanguageContext)
}