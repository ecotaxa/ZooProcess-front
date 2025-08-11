/**
 * Vérifie si une clé de traduction existe dans les messages actuels
 * @param {string} key - La clé de traduction à vérifier
 * @param {function} t - La fonction de traduction de react-i18next
 * @returns {boolean} - true si la clé existe, false sinon
 */
export const keyExists = (key, t) => {
  if (!key || !t) return false;

  try {
    // Get the translation for the key
    const translation = t(key, { returnObjects: true });

    // Check if the translation exists and is not the key itself
    // (react-i18next returns the key if the translation is not found)
    return translation !== key && translation !== undefined;
  } catch (error) {
    return false;
  }
};
