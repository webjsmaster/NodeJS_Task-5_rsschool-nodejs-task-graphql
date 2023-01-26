import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { idParamSchema } from '../../utils/reusedSchemas'
import { createPostBodySchema, changePostBodySchema } from './schema'
import type { PostEntity } from '../../utils/DB/entities/DBPosts'

type CreatePostDTO = Omit<PostEntity, 'id'>
type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
	fastify,
): Promise<void> => {
	fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
		return await fastify.db.posts.findMany()
	})

	fastify.get(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<PostEntity> {
			const { id } = request.params as { id: string }
			console.log(id)

			const post = await fastify.db.posts.findOne({
				key: 'id',
				equals: id,
			})

			if (post) {
				return post as PostEntity
			} else {
				throw reply.code(404)
			}
		},
	)

	fastify.post(
		'/',
		{
			schema: {
				body: createPostBodySchema,
			},
		},
		async function (request, reply): Promise<PostEntity> {
			const body = request.body as CreatePostDTO
			return await fastify.db.posts.create(body)
		},
	)

	fastify.delete(
		'/:id',
		{
			schema: {
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<PostEntity> {
			const { id } = request.params as { id: string }
			try {
				return await fastify.db.posts.delete(id)
			} catch (error) {
				throw reply.code(400)
			}
		},
	)

	fastify.patch(
		'/:id',
		{
			schema: {
				body: changePostBodySchema,
				params: idParamSchema,
			},
		},
		async function (request, reply): Promise<PostEntity> {
			const body = request.body as ChangePostDTO
			const { id } = request.params as { id: string }
			try {
				return await fastify.db.posts.change(id, body)
			} catch (error) {
				throw reply.code(400)
			}
		},
	)
}

export default plugin
