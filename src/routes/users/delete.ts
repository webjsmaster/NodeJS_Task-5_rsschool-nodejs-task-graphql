import { HttpError, HttpErrors } from '@fastify/sensible/lib/httpError'
import { FastifyRequest } from 'fastify'
import DB from '../../utils/DB/DB'
import { PostEntity } from '../../utils/DB/entities/DBPosts'
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles'

export async function deleteUser(
	request: FastifyRequest,
	fastify: { db: DB; httpErrors: HttpErrors },
) {
	const { id } = request.params as { id: string }

	const users = await fastify.db.users.findMany({
		key: 'subscribedToUserIds',
		inArray: id,
	})

	const userProfile = (await fastify.db.profiles.findOne({
		key: 'userId',
		equals: id,
	})) as ProfileEntity

	const userPosts = (await fastify.db.posts.findMany({
		key: 'userId',
		equals: id,
	})) as PostEntity[]

	try {
		const user = await fastify.db.users.delete(id)

		users.forEach(async (user) => {
			await fastify.db.users.change(user.id, {
				subscribedToUserIds: [
					...user.subscribedToUserIds.filter((el) => el !== id),
				],
			})
		})

		userPosts.forEach(async (post) => {
			await fastify.db.posts.delete(post.id)
		})

		await fastify.db.profiles.delete(userProfile.id)

		return user
	} catch (error) {
		return fastify.httpErrors.badRequest('User not fount') as HttpError
	}
}
