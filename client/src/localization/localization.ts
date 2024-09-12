
const _l10n: {[key: string]: any} = {
    "en-US": JSON.parse(require("./en-us.json")),
    "ko-KR": JSON.parse(require("./ko-kr.json")),
}

/** This proxy provides localization assets corresponds to a user language. */
// export const l10n = _l10n[navigator.language] ?? _l10n["en-US"];
export const l10n = _l10n["en-US"];