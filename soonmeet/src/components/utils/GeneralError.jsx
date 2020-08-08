import React from 'react';

/**
 * Render jsx for general error not associated with any field.
 * @param message
 * @returns jsx
 */
const GeneralError = message => {
  return <small className="text-danger">{message}</small>
};

export default GeneralError;