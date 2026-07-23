import { mockBackend, ApiError } from './client'

const { delay, readDb, writeDb, makeToken } = mockBackend

/** POST /api/v1/accounts/register/ */
export async function register({ fullName, email, password, accountType }) {
  await delay()
  const db = readDb()
  if (db.users.find((u) => u.email === email)) {
    throw new ApiError(400, { email: ['A user with this email already exists.'] })
  }
  const user = {
    id: crypto.randomUUID(),
    fullName,
    email,
    password,
    accountType,
    isEmailVerified: false,
    isBusinessVerified: false,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  writeDb(db)
  return { id: user.id, email: user.email, message: 'Account created. Check your email to verify.' }
}

/** POST /api/v1/accounts/login/ */
export async function login({ email, password }) {
  await delay()
  const db = readDb()
  const user = db.users.find((u) => u.email === email)
  if (!user || user.password !== password) {
    throw new ApiError(401, { detail: 'Invalid email or password.' })
  }
  const access = makeToken('access', email)
  const refresh = makeToken('refresh', email)
  return { access, refresh, user: publicUser(user) }
}

/** POST /api/v1/accounts/refresh/ */
export async function refreshToken({ refresh }) {
  await delay(300)
  if (!refresh) throw new ApiError(401, { detail: 'Refresh token missing or expired.' })
  const email = safeDecodeEmail(refresh)
  return { access: makeToken('access', email || 'unknown') }
}

/** POST /api/v1/accounts/logout/ */
export async function logout({ refresh }) {
  await delay(200)
  return { detail: 'Logged out.' }
}

/** GET /api/v1/accounts/me/ */
export async function getMe({ access }) {
  await delay(300)
  const email = safeDecodeEmail(access)
  const db = readDb()
  const user = db.users.find((u) => u.email === email)
  if (!user) throw new ApiError(401, { detail: 'Not authenticated.' })
  return publicUser(user)
}

/** PUT /api/v1/accounts/profile/update/ */
export async function updateProfile({ access, updates }) {
  await delay()
  const email = safeDecodeEmail(access)
  const db = readDb()
  const idx = db.users.findIndex((u) => u.email === email)
  if (idx === -1) throw new ApiError(401, { detail: 'Not authenticated.' })
  db.users[idx] = { ...db.users[idx], ...updates }
  writeDb(db)
  return publicUser(db.users[idx])
}

/** PUT /api/v1/accounts/password/change/ */
export async function changePassword({ access, currentPassword, newPassword }) {
  await delay()
  const email = safeDecodeEmail(access)
  const db = readDb()
  const idx = db.users.findIndex((u) => u.email === email)
  if (idx === -1) throw new ApiError(401, { detail: 'Not authenticated.' })
  if (db.users[idx].password !== currentPassword) {
    throw new ApiError(400, { currentPassword: ['Current password is incorrect.'] })
  }
  db.users[idx].password = newPassword
  writeDb(db)
  return { detail: 'Password updated.' }
}

/** POST /api/v1/accounts/password/forgot/ */
export async function forgotPassword({ email }) {
  await delay()
  const db = readDb()
  const user = db.users.find((u) => u.email === email)
  const resetToken = user ? makeToken('reset', email) : null
  return { detail: 'If that email exists, a reset link has been sent.', __mockResetToken: resetToken }
}

/** POST /api/v1/accounts/password/reset/ */
export async function resetPassword({ uid, token, newPassword }) {
  await delay()
  const email = safeDecodeEmail(token)
  const db = readDb()
  const idx = db.users.findIndex((u) => u.email === email)
  if (idx === -1) throw new ApiError(400, { detail: 'Invalid or expired reset link.' })
  db.users[idx].password = newPassword
  writeDb(db)
  return { detail: 'Password has been reset. You can log in now.' }
}

/** POST /api/v1/accounts/email/verify/ */
export async function verifyEmail({ token }) {
  await delay()
  const email = safeDecodeEmail(token)
  const db = readDb()
  const idx = db.users.findIndex((u) => u.email === email)
  if (idx === -1) throw new ApiError(400, { detail: 'Invalid or expired verification link.' })
  db.users[idx].isEmailVerified = true
  writeDb(db)
  return { detail: 'Email verified.' }
}

/** POST /api/v1/accounts/email/resend-verification/ */
export async function resendVerification({ email }) {
  await delay()
  const db = readDb()
  const user = db.users.find((u) => u.email === email)
  const verifyToken = user ? makeToken('verify', email) : null
  return { detail: 'If that email exists, a verification link has been sent.', __mockVerifyToken: verifyToken }
}

// ---- helpers ----
function publicUser(user) {
  const { password, ...rest } = user
  return rest
}
function safeDecodeEmail(token) {
  try {
    return atob(token.split('.')[1])
  } catch {
    return null
  }
}