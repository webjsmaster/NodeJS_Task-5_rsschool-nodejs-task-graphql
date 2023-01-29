import {
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql'
import { UserEntity } from '../../utils/DB/entities/DBUsers'
import {
	MemberTypeType,
	PostType,
	ProfileType,
	UsersWithCompleteInfo,
	UserType,
} from './typesSchemaGql'

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		users: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
			resolve: async ({ getAllUsers }) => await getAllUsers(),
		},
		profiles: {
			type: new GraphQLNonNull(
				new GraphQLList(new GraphQLNonNull(ProfileType)),
			),
			resolve: async ({ getAllProfiles }) => await getAllProfiles(),
		},
		posts: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
			resolve: async ({ getAllPosts }) => await getAllPosts(),
		},
		memberTypes: {
			type: new GraphQLNonNull(
				new GraphQLList(new GraphQLNonNull(MemberTypeType)),
			),
			resolve: async ({ getAllMemberTypes }) => await getAllMemberTypes(),
		},
		user: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ getOneUser }, args) => {
				const data = await getOneUser(args)
				if (data) {
					return data
				} else {
					throw new Error('User not found')
				}
			},
		},
		post: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ getOnePost }, args) => {
				const data = await getOnePost(args)
				if (data) {
					return data
				} else {
					throw new Error('Post not found')
				}
			},
		},
		profile: {
			type: ProfileType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ getOneProfile }, args) => {
				const data = await getOneProfile(args)
				if (data) {
					return data
				} else {
					throw new Error('Profile not found')
				}
			},
		},
		memberType: {
			type: MemberTypeType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ getOneMemberType }, args) => {
				const data = await getOneMemberType(args)
				if (data) {
					return data
				} else {
					throw new Error('Member type not found')
				}
			},
		},
		usersWithCompleteInfo: {
			type: new GraphQLNonNull(
				new GraphQLList(new GraphQLNonNull(UsersWithCompleteInfo)),
			),
			resolve: async ({ getAllUsers }) => {
				const users: UserEntity[] = await getAllUsers()

				console.log('📢 [schemaGraphql.ts:103]', users)

				// let arr: UserEntity[]

				// users.forEach((user) => {
				// 	arr.push(user)

				// 	console.log('📢 [schemaGraphql.ts:110]', arr)
				// })

				let arr = users.map((user) => ({ ...user, test: 'test' }))

				console.log('📢 [schemaGraphql.ts:120]', arr)

				return users

				// if (data) {
				// 	return data
				// } else {
				// 	throw new Error('Member type not found')
				// }
			},
		},
	}),
})

const mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		createUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				lastName: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ createUser }, args) => {
				return await createUser(args)
			},
		},
	}),
})

export const Schema: GraphQLSchema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType,
	//types: [UserType],
})
