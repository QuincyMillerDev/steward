import { useTheme, usePreferences, useSettingsActions } from "../../store"
import SettingsSection from "../settings/SettingsSection"
import SettingsField from "../settings/SettingsField"
import SettingsForm from "../settings/SettingsForm"
import Listbox from "../ui/Listbox"
import { allThemes } from "../../lib/themes"

export default function GeneralTab() {
  const theme = useTheme()
  const preferences = usePreferences()
  const { setTheme, updatePreference } = useSettingsActions()

  const fontSizes = [
    { value: 12, label: "Small (12px)" },
    { value: 14, label: "Normal (14px)" },
    { value: 16, label: "Large (16px)" },
    { value: 18, label: "Extra Large (18px)" },
  ]

  const themeOptions = allThemes.map(themeObj => ({
    value: themeObj.name,
    label: themeObj.label
  }))

  const handleFontSizeChange = (value: string) => {
    updatePreference('fontSize', parseInt(value))
  }

  const handleThemeChange = (value: string) => {
    setTheme(value as 'system' | 'light' | 'dark')
  }

  return (
    <SettingsForm 
      title="General Settings"
      description="Configure basic application preferences and appearance"
    >
      <SettingsSection title="Appearance" description="Customize the visual appearance of the application">
        <SettingsField 
          label="Theme" 
          description="Choose a theme that suits your preference"
        >
          <Listbox 
            value={theme} 
            onChange={handleThemeChange}
            options={themeOptions}
            placeholder="Select theme"
          />
        </SettingsField>

        <SettingsField 
          label="Font Size" 
          description="Adjust text size for better readability"
        >
          <Listbox 
            value={preferences.fontSize.toString()} 
            onChange={handleFontSizeChange}
            options={fontSizes.map(size => ({ value: size.value.toString(), label: size.label }))}
            placeholder="Select font size"
          />
        </SettingsField>
      </SettingsSection>
    </SettingsForm>
  )
}
