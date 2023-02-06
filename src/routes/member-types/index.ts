import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { idParamSchema } from '../../utils/reusedSchemas'
import { changeMemberTypeBodySchema } from './schema'
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes'

type ChangeMemberTypeDTO = Partial<Omit<MemberTypeEntity, 'id'>>

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
	fastify,
): Promise<void> => {
	fastify.get('/', async function (request, reply): Promise<
		MemberTypeEntity[]
	> {
		return await fastify.db.memberTypes.findMany()
	})

	fastify.get(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<MemberTypeEntity> {
			const { id } = request.params as { id: string }
			const memberTypes = await fastify.db.memberTypes.findOne({
				key: 'id',
				equals: id,
			})

			if (memberTypes) {
				return memberTypes
			} else {
				throw reply.code(404)
			}
		},
	)

	fastify.patch(
		'/:id',
		{
			schema: {
				body: changeMemberTypeBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<MemberTypeEntity> {
			const { id } = request.params as { id: string }
			const body = request.body as ChangeMemberTypeDTO
			try {
				return await fastify.db.memberTypes.change(id, body)
			} catch (error) {
				throw reply.code(400)
			}
		},
	)
}

export default plugin
