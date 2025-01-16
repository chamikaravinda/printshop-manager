export const validateUser = (user) => {
    const errors = [];

    // Validate name (if provided)
    if (user.name !== null && user.name !== undefined) {
      if (!/^[a-zA-Z\s]+$/.test(user.name)) {
        errors.push("Name can only contain letters and spaces.");
      }
    }

    // Validate email (if provided)
   if (user.email !== null && user.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      errors.push("Invalid email format.");
    }

    // Validate password (if provided)
    if (user.password !== null && user.password !== undefined) {
      if (user.password.length <= 6) {
        errors.push("Password must be longer than 6 characters.");
      }
    }

    return errors.length > 0 ? errors : null;
  }