// export const removeDigest = (obj: any) => {
//     const { digest, ...rest } = obj;
//     return rest;
//   };

export const removeDigest = (obj: any) => {
  // Check if obj has properties other than digest
  if (typeof obj === 'object' && obj !== null) {
    const { digest, ...rest } = obj;

    // Check if rest still contains any other properties
    if (Object.keys(rest).length > 0) {
      return rest;
    }
  }

  // If no other properties, return obj as is or some fallback
  return obj;
};

export const removeDigestSafe = (obj: any) => {
  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj).filter(([key, value]) => key !== 'digest');

    // If there are still key-value pairs after removing digest, return the object
    if (entries.length > 0) {
      return Object.fromEntries(entries);
    }
  }

  // If no properties left or it's not an object, return it as is
  return obj;
};

export const removeDigestFromError = (error: Error) => {
  // Convert error to an object (spread syntax won't work with Error directly)
  const errorObj = Object.getOwnPropertyDescriptors(error);

  // Remove the digest property if it exists
  if (errorObj.digest) {
    delete errorObj.digest;
  }

  // Reconstruct the Error object without the digest
  const cleanedError = new Error(error.message);
  Object.assign(cleanedError, errorObj); // Restore other properties

  return cleanedError;
};

//   // Example usage:
//   try {
//     throw new Error("Something went wrong");
//   } catch (error) {
//     const cleanedError = removeDigestFromError(error);
//     console.log("Cleaned Error Object:", cleanedError);
//   }

export interface CustomError {
  obj: any;
  digest: string;
}
