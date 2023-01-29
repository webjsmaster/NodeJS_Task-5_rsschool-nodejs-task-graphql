import { HttpError, HttpErrors } from '@fastify/sensible/lib/httpError'
import { FastifyRequest } from 'fastify/types/request'
import DB from '../../utils/DB/DB'
import { UserEntity } from '../../utils/DB/entities/DBUsers'

//TODO это пользователи, которые подписаны на текущего пользователя.

export async function subscribed(
	request: FastifyRequest,
	fastify: { db: DB; httpErrors: HttpErrors },
) {
	const { id } = request.params as { id: string }
	const { userId } = request.body as { userId: string }
	const userSubscribed = await fastify.db.users.findOne({
		key: 'id',
		equals: userId,
	})

	const user = await fastify.db.users.findOne({
		key: 'id',
		equals: id,
	})

	if (!user) return fastify.httpErrors.badRequest('User not fount') as HttpError

	if (userSubscribed?.subscribedToUserIds.indexOf(id) === -1) {
		userSubscribed?.subscribedToUserIds.push(id)
	} else {
		return fastify.httpErrors.badRequest(
			'The user is already subscribed',
		) as HttpError
	}

	fastify.db.users.change(userId, {
		subscribedToUserIds: userSubscribed?.subscribedToUserIds,
	})

	return user as UserEntity
}
