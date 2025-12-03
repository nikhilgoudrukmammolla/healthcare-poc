"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageSelectorProps {
  label: string
  languages: Language[]
  selectedLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSelector({ label, languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const selected = languages.find((lang) => lang.code === selectedLanguage)

return (
  <div className="
    rounded-xl 
    border 
    p-5 
    shadow-lg 
    bg-gradient-to-br from-background/60 to-card 
    backdrop-blur-md 
    border-white/10 
    transition-all
  ">
    <label className="mb-3 block text-sm font-medium text-card-foreground/80">
      {label}
    </label>

    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger
        className="
          w-full 
          h-12 
          text-base 
          rounded-lg
          bg-muted/30 
          border border-border/50 
          hover:bg-muted/50 
          transition
        "
      >
        <SelectValue>
          {selected && (
            <span className="flex items-center gap-2">
              <span className="text-xl">{selected.flag}</span>
              <span className="hidden sm:inline font-medium">{selected.name}</span>
              <span className="inline sm:hidden text-sm">{selected.name.split(' ')[0]}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="min-w-max rounded-lg shadow-xl bg-popover/90 backdrop-blur-md border border-border/30">
        {languages.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className="focus:bg-muted/40"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

}
