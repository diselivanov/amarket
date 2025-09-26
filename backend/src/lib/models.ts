import { pick } from '@amarket/shared/src/pick'
import { type User } from '@prisma/client'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'name', 'permissions', 'email', 'phone', 'balance', 'description', 'avatar'])
}
