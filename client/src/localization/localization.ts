import { SettingsBinding } from "../settings/settings_binding";

const _l10n: {[key: string]: any} = {
    "en-US": JSON.parse(require("./en-us.json")),
    "ko-KR": JSON.parse(require("./ko-kr.json")),
    "ja-JP": JSON.parse(require("./ja-JP.json")),
}

/** This proxy provides localization assets corresponds to a user language. */
export const l10n = new Proxy(_l10n, {
    get: function(_, prop) {
        const language = SettingsBinding.getValue("language") ?? "system";

        if (language == "system") {
            switch (navigator.language.split("-")[0]) {
                case "ko": return _l10n["ko-KR"][prop];
                case "ja": return _l10n["ja-JP"][prop];
                default  : return _l10n["en-US"][prop];
            }
        }

        return _l10n[language][prop];
    }
});