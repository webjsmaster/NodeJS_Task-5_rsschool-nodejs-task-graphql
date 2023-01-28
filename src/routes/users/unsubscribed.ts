import { HttpError, HttpErrors } from '@fastify/sensible/lib/httpError'
import { FastifyRequest } from 'fastify/types/request'
import DB from '../../utils/DB/DB'
import { UserEntity } from '../../utils/DB/entities/DBUsers'

export async function unsubscribed(
	request: FastifyRequest,
	fastify: { db: DB; httpErrors: HttpErrors },
) {
	const { id } = request.params as { id: string }
	const { userId } = request.body as { userId: string }

	const user = await fastify.db.users.findOne({
		key: 'id',
		equals: userId,
	})

	let subscribedToUserIds: string[]

	if (user?.subscribedToUserIds.indexOf(id) !== -1) {
		subscribedToUserIds = user?.subscribedToUserIds.filter(
			(uId) => uId !== id,
		) as string[]
	} else {
		return fastify.httpErrors.badRequest(
			'User not in subscriptions',
		) as HttpError
	}

	await fastify.db.users.change(userId, {
		subscribedToUserIds: subscribedToUserIds,
	})

	return user as UserEntity
}
