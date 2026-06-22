import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface CustomDropdownProps {
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  error?: string;
}

export function CustomDropdown({ placeholder, value, options, onChange, error }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-2.5 text-sm text-left flex items-center justify-between transition-all outline-none focus:border-gold-deep dark:border-paper/15 dark:bg-paper/5 dark:text-paper",
          error ? "border-red-500 focus:border-red-500" : ""
        )}
      >
        <span className={cn(value ? "text-ink dark:text-paper font-medium" : "text-ink/40 dark:text-paper/40")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-ink/60 dark:text-paper/60 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-ink/10 bg-paper dark:border-paper/15 dark:bg-ink shadow-luxe overflow-hidden"
          >
            <div className="p-1.5 grid gap-0.5 max-h-40 overflow-y-auto select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold-deep/20">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-all",
                    value === option.value
                      ? "bg-gold-deep text-ink font-medium"
                      : "text-ink/80 hover:bg-gold/10 hover:text-gold-deep dark:text-paper/80 dark:hover:bg-gold/20 dark:hover:text-gold"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
