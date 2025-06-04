// import { Card, CardContent, Typography } from "@mui/material"
import { Card, CardBody, Button } from "@heroui/react"
import { useRouter } from "next/navigation"

export const ErrorComponent = ({error}) => {
  console.log("ErrorComponent: error", error)
  const router = useRouter()
  
  // Fonction pour extraire le message d'erreur selon le type d'entrée
  const extractErrorMessage = (err) => {
    // Prevent circular references
    if (!err) return "Unknown error";
    
    // Check for API authentication error structure
    if ((err.response && err.response.data && err.response.data?.code === 'AUTH_TOKEN_EXPIRED')
        || err.code === 'AUTH_TOKEN_EXPIRED'
    ) {
      return err.response?.data?.message || 'Your session has expired. Please log in again.';
    }

    // if (err.response && err.response.data && err.response.data?.message) {
    //   return err.response.data.message;
    // }

    // Si c'est un tableau, prendre le premier élément
    if (Array.isArray(err)) {
      console.debug("ErrorComponent - Array")
      // return err.length > 0 ? String(err[0]) : "Unknown error";
      if (err.length > 0) {
          const firstError = err[0];
        // If the first element is an object with a message property, use that
        if (typeof firstError === 'object' && firstError !== null && firstError.message) {
          return firstError.message;
        }
        // Otherwise try to convert to string
        return String(firstError);
      }
      return "Unknown error";
    }
    
    // Handle DriveAccessException specifically
    if (err.name === 'DriveAccessException' || 
      (err.error && err.error.name === 'DriveAccessException')) {
        console.debug("ErrorComponent - DriveAccessException")
      const errorObj = err.error || err;
      return `Permission denied: Cannot access or create directory at "${errorObj.url}". Please check if the network drive is mounted and you have write permissions.`;
    }

    // Si c'est un objet avec une propriété message
    if (err && typeof err === 'object' && err.message) {
      console.debug("ErrorComponent - message")
      return String(err.message);
    }
    
    // Sinon, convertir en chaîne
    try {
      console.debug("ErrorComponent - String")
      return String(err);
    } catch (e) {
      return "Error cannot be displayed";
    }
  };
  
  // Obtenir le message principal
  let message;
  try {
    message = extractErrorMessage(error);
  } catch (e) {
    message = "Error processing error message";
  }
  
  // Gérer les cas spéciaux
  if (error && error.status == 500) {
    if (error.name == "AxiosError") {
      message = "Connection to server failed. Please check your internet connection or call the geeks";
    }  
  }
  
  // Check if it's an authentication error - safely
  const isAuthError = error && (
    (error.response && error.response.data && error.response.data.code === 'AUTH_TOKEN_EXPIRED') ||
    (error.code === 'AUTH_TOKEN_EXPIRED') ||
    error.status === 401
  );

  console.error("ErrorComponent: isAuthError", isAuthError)
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  // Safely create error details without recursion
  const getErrorDetails = () => {
    if (!error) return null;
    
    // Si c'est un tableau, afficher tous les éléments
    if (Array.isArray(error)) {
      return (
        <>
          <h2>Error Details</h2>
          <ul>
            {error.map((item, index) => (
              <li key={index}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
            ))}
          </ul>
        </>
      );
    }
    
    // Si c'est un objet, afficher ses propriétés de manière sécurisée
    if (error && typeof error === 'object') {
      // Create a safe copy without circular references
      const safeProps = {};
      try {
        // Only include primitive properties and simple objects
        const safeKeys = ['code', 'name', 'message', 'status', 'description', 'filename', 'number'];
        safeKeys.forEach(key => {
          if (error[key] !== undefined) {
            safeProps[key] = error[key];
          }
        });
        
        // Safely add stack
        if (error.stack) {
          safeProps.stack = String(error.stack).split('\n').slice(0, 10).join('\n');
        }
        
        // Safely add URL
        if (error.config && error.config.url) {
          safeProps.url = error.config.url;
        }
        
        // Safely add response data
        if (error.response && error.response.data) {
          try {
            safeProps.responseData = JSON.stringify(error.response.data).substring(0, 500);
          } catch (e) {
            safeProps.responseData = "Cannot display response data";
          }
        }
      } catch (e) {
        return <p>Error details cannot be displayed: {e.message}</p>;
      }
      
      return (
        <>
          <h2>Debug</h2>
          {Object.entries(safeProps).map(([key, value]) => (
            <h4 key={key} data-testid={`error-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: 
              {key === 'stack' ? 
                <span style={{whiteSpace: "pre-wrap"}}><br/>{value}</span> : 
                <span> {String(value)}</span>
              }
            </h4>
          ))}
        </>
      );
    }
    
    return null;
  };

  return (
    <Card>
      <CardBody>
        <h1 data-testid="error-title" className="text-red-600">{message}</h1>
        {message !== extractErrorMessage(error) && (
          <h4 data-testid="error-message">{message}</h4>
        )}
        <br/>
        {isAuthError && (
          <div className="flex gap-2 mt-4 mb-4">
            <Button color="primary" onPress={handleLogin}>
              Log in again
            </Button>
            <Button 
              color="default" 
              variant="flat" 
              onPress={() => router.push('/')}
            >
              Go to Home
            </Button>
          </div>
        )}
         {/*getErrorDetails()*/}
        {process.env.NODE_ENV === 'development' && getErrorDetails() }
      </CardBody>
    </Card>
  );
}
