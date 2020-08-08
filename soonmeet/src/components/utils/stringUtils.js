/**
 * Function returning 2-char string consisting of first name first letter and last name first letter.
 * @param firstName
 * @param lastName
 * @returns {string|*}
 */
export const getAvatarInitials = (firstName, lastName) => {
  if (firstName && lastName) {
    return firstName[0] + lastName[0];
  }
  return '--';
};
