export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 0) return 'Password must be at least 1 characters long.'
  return ''
}
