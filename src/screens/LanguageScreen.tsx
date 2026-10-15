import { Header, Screen } from "@/components/chrome";
import { useApp } from "@/store/app-store";
import type { Lang } from "@/data/i18n";

const options: { id: Lang; label: string; note: string }[] = [
  { id: "en", label: "English", note: "Continue in English" },
  { id: "es", label: "Español", note: "Continuar en español" },
];

export function LanguageScreen() {
  const app = useApp();
  return (
    <Screen>
      <Header title="Language" />
      <div className="ios-group">
        {options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => app.setLanguage(opt.id)} className="ios-row press w-full">
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] leading-[22px]">{opt.label}</span>
              <span className="block text-[13px] leading-[18px] text-[#9ca3af]">{opt.note}</span>
            </span>
            {app.language === opt.id ? <span className="text-[17px] text-lime">✓</span> : null}
          </button>
        ))}
      </div>
      <p className="px-4 pt-2 text-[13px] leading-[18px] text-[#9ca3af]">{app.t("languageNote")}</p>
    </Screen>
  );
}
