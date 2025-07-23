/**
 * Vérifie si une clé de traduction existe dans les messages actuels
 * @param {string} key - La clé de traduction à vérifier
 * @param {object} messages - L'objet contenant toutes les traductions
 * @returns {boolean} - true si la clé existe, false sinon
 */
// export function keyExists(key, messages) {

//   console.debug("Searching:", key)
//   console.debug("In:",messages)



//   if (!key || !messages) return false;
  
//   // Si la clé est une chaîne simple (sans points)
//   if (!key.includes('.')) {
//     return messages.hasOwnProperty(key) && messages[key] !== undefined;
//   }

//   // Gestion des clés imbriquées (comme 'user.profile.name')
//   const keyParts = key.split('.');
//   let current = messages;
  
//   for (const part of keyParts) {
//     if (current === undefined || current === null || typeof current !== 'object') {
//       return false;
//     }
//     current = current[part];
//   }
  
//   return current !== undefined;
// }

  export const keyExists = (key,t) => {
    try {
      t(key);
      return true;
    } catch (error) {
      return false;
    }
  };