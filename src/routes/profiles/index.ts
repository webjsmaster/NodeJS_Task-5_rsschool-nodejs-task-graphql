import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { idParamSchema } from '../../utils/reusedSchemas'
import { createProfileBodySchema, changeProfileBodySchema } from './schema'
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles'

type CreateProfileDTO = Omit<ProfileEntity, 'id'>
type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
	fastify,
): Promise<void> => {
	fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
		return await fastify.db.profiles.findMany()
	})

	fastify.get(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<ProfileEntity> {
			const { id } = request.params as { id: string }
			const profile = await fastify.db.profiles.findOne({
				key: 'id',
				equals: id,
			})
			if (profile) {
				return profile
			} else {
				throw reply.code(404)
			}
		},
	)

	fastify.post(
		'/',
		{
			schema: {
				body: createProfileBodySchema,
			},
		},
		async function (request, reply): Promise<ProfileEntity> {
			const body = request.body as CreateProfileDTO
			if (body.memberTypeId !== 'basic' && body.memberTypeId !== 'business') {
				throw reply.code(400)
			}
			const profileUser = await fastify.db.profiles.findOne({
				key: 'userId',
				equals: body.userId,
			})
			if (profileUser) throw reply.code(400)
			const profile = await fastify.db.profiles.create(body)
			if (profile) {
				return profile
			} else {
				throw reply.code(400)
			}
		},
	)

	fastify.delete(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<ProfileEntity> {
			const { id } = request.params as { id: string }
			try {
				return await fastify.db.profiles.delete(id)
			} catch (error) {
				throw reply.code(400)
			}
		},
	)

	fastify.patch(
		'/:id',
		{
			schema: {
				body: changeProfileBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<ProfileEntity> {
			const { id } = request.params as { id: string }
			const body = request.body as ChangeProfileDTO
			try {
				return await fastify.db.profiles.change(id, body)
			} catch (error) {
				throw reply.code(400)
			}
		},
	)
}

export default plugin
