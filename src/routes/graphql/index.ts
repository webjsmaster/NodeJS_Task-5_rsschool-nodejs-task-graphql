import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { graphqlBodySchema } from './schema'
import { graphql } from 'graphql'
import { RootValue } from './rootValue'
import { Schema } from './schemaGraphql'

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
	fastify,
): Promise<void> => {
	const rootValue = RootValue(fastify)

	fastify.post(
		'/',
		{
			schema: {
				body: graphqlBodySchema,
			},
		},
		async function (request, reply) {
			const { query, variables } = request.body as {
				query: string
				variables: {}
			}

			return await graphql({
				schema: Schema,
				source: query,
				rootValue: rootValue,
				contextValue: fastify,
				variableValues: variables,
			})
		},
	)
}

export default plugin

// 2.2. Get user, profile, post, memberType by id - 4 operations in one query какой все-таки правильный вариант:
// 1. принимаем один id и по нему ищем во всех сущностях
// или
// 2. принимаем userId, profileId, postId, memberTypeId и ищем в каждой из сущностей по своему id?
