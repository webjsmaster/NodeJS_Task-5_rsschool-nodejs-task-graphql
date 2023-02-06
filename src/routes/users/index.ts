import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { idParamSchema } from '../../utils/reusedSchemas'
import {
	createUserBodySchema,
	changeUserBodySchema,
	subscribeBodySchema,
} from './schemas'
import type { UserEntity } from '../../utils/DB/entities/DBUsers'
import { HttpError } from '@fastify/sensible/lib/httpError'
import { subscribed } from './subscribed'
import { unsubscribed } from './unsubscribed'
import { deleteUser } from './delete'

type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>
type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
	fastify,
): Promise<void> => {
	fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
		return fastify.db.users.findMany()
	})

	fastify.get(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<UserEntity | HttpError> {
			const { id } = request.params as { id: string }
			const user = await fastify.db.users.findOne({ key: 'id', equals: id })
			if (user) {
				return user
			} else {
				return fastify.httpErrors.notFound('User not found') as HttpError
			}
		},
	)

	fastify.post(
		'/',
		{
			schema: {
				body: createUserBodySchema,
			},
		},
		async function (request, reply): Promise<UserEntity> {
			const { firstName, lastName, email } = request.body as CreateUserDTO
			const user = await fastify.db.users.create({ firstName, lastName, email })
			return user
		},
	)

	fastify.delete(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<UserEntity | HttpError> {
			return deleteUser(request, fastify)
		},
	)

	fastify.post(
		'/:id/subscribeTo',
		{
			schema: {
				body: subscribeBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<UserEntity | HttpError> {
			return subscribed(request, fastify)
		},
	)

	fastify.post(
		'/:id/unsubscribeFrom',
		{
			schema: {
				body: subscribeBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<UserEntity | HttpError> {
			return unsubscribed(request, fastify)
		},
	)

	fastify.patch(
		'/:id',
		{
			schema: {
				body: changeUserBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<UserEntity | HttpError> {
			const body = request.body as ChangeUserDTO
			const { id } = request.params as { id: string }
			try {
				return await fastify.db.users.change(id, body)
			} catch (error) {
				return fastify.httpErrors.badRequest('User not found') as HttpError
			}
		},
	)
}

export default plugin
