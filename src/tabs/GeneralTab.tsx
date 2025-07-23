import { useState } from "react"
import { useTheme } from "../contexts/ThemeContext"
import SettingsSection from "../components/settings/SettingsSection"
import SettingsField from "../components/settings/SettingsField"
import Listbox from "../components/ui/Listbox"

export default function GeneralTab() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [fontSize, setFontSize] = useState("large")

  const fontSizes = [
    { value: "normal", label: "Normal (14px)" },
    { value: "large", label: "Large (16px)" },
    { value: "xlarge", label: "Extra Large (18px)" },
  ]

  // Convert theme options to the format expected by Listbox
  const themeOptions = availableThemes.map(theme => ({
    value: theme.name,
    label: theme.label
  }))

  return (
    <SettingsSection title="Appearance" description="Customize the visual appearance of the application">
      <SettingsField 
        label="Theme" 
        description="Choose a theme that suits your preference"
      >
        <Listbox 
          value={currentTheme} 
          onChange={setTheme}
          options={themeOptions}
          placeholder="Select theme"
        />
      </SettingsField>

      <SettingsField 
        label="Font Size" 
        description="Adjust text size for better readability"
      >
        <Listbox 
          value={fontSize} 
          onChange={setFontSize}
          options={fontSizes}
          placeholder="Select font size"
        />
      </SettingsField>
    </SettingsSection>
  )
}
