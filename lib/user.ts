export function getUserId(): string {
  let userId = localStorage.getItem('user_id')
  
  if (!userId) {
    // Generate a new UUID if none exists
    userId = crypto.randomUUID()
    localStorage.setItem('user_id', userId)
  }
  
  return userId
} 