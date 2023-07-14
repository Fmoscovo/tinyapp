function getUserByEmail(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
}
module.exports = { getUserByEmail };
