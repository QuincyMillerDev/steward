// Reusable Listbox component using Headless UI
import { Listbox as HeadlessListbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { FaCheck, FaChevronDown } from "react-icons/fa"

interface ListboxOption {
  value: string
  label: string
}

interface ListboxProps {
  value: string
  onChange: (value: string) => void
  options: ListboxOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function Listbox({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select option",
  disabled = false,
  className = ""
}: ListboxProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <HeadlessListbox 
      value={value} 
      onChange={onChange}
      disabled={disabled}
      className={className}
    >
      <div className="relative">
        <ListboxButton className="relative w-full cursor-pointer rounded-md bg-secondary py-2 pl-3 pr-10 text-left text-sm text-text-primary border border-border hover:border-accent/50 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="block truncate">
            {selectedOption?.label || placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown className="h-3 w-3 text-text-secondary" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions 
          anchor="bottom"
          className="z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-md bg-secondary py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-border"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ focus, selected }) =>
                `relative cursor-pointer select-none py-2 pl-8 pr-4 transition-colors ${
                  focus ? "bg-accent/5 text-text-primary" : "text-text-primary"
                } ${selected ? "bg-accent/10 text-accent" : ""}`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                    {option.label}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-accent">
                      <FaCheck className="h-3 w-3" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </HeadlessListbox>
  )
}