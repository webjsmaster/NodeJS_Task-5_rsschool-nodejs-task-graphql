import { FastifyInstance } from 'fastify'
import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql'
import {
	MemberTypeType,
	PostType,
	ProfileType,
	UsersSubscribed,
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
				return await getAllUsers()
			},
		},
		userWithCompleteInfo: {
			type: new GraphQLNonNull(UsersWithCompleteInfo),
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
		usersSubscribed: {
			type: new GraphQLNonNull(
				new GraphQLList(new GraphQLNonNull(UsersSubscribed)),
			),
			resolve: async ({ getAllUsers }) => {
				return await getAllUsers()
			},
		},
		userSubscribed: {
			type: new GraphQLNonNull(UsersSubscribed),
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
		createProfile: {
			type: ProfileType,
			args: {
				avatar: { type: new GraphQLNonNull(GraphQLString) },
				sex: { type: new GraphQLNonNull(GraphQLString) },
				birthday: { type: new GraphQLNonNull(GraphQLInt) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				street: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async ({ createProfile }, args) => {
				return await createProfile(args)
			},
		},
		createPost: {
			type: PostType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ createPost }, args) => {
				return await createPost(args)
			},
		},
		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				lastName: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ updateUser }, args, fastify: FastifyInstance) => {
				const user = await fastify.db.users.findOne({
					key: 'id',
					equals: args.id,
				})
				if (user) {
					return await updateUser(args.id, args)
				} else {
					throw new Error('User not found')
				}
			},
		},
		updateProfile: {
			type: ProfileType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				avatar: { type: new GraphQLNonNull(GraphQLString) },
				sex: { type: new GraphQLNonNull(GraphQLString) },
				birthday: { type: new GraphQLNonNull(GraphQLInt) },
				country: { type: new GraphQLNonNull(GraphQLString) },
				street: { type: new GraphQLNonNull(GraphQLString) },
				city: { type: new GraphQLNonNull(GraphQLString) },
				memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async ({ updateProfile }, args, fastify: FastifyInstance) => {
				const profile = await fastify.db.profiles.findOne({
					key: 'id',
					equals: args.id,
				})
				if (profile) {
					return await updateProfile(args.id, args)
				} else {
					throw new Error('Profile not found')
				}
			},
		},
		updatePost: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async ({ updatePost }, args, fastify: FastifyInstance) => {
				const post = await fastify.db.posts.findOne({
					key: 'id',
					equals: args.id,
				})
				if (post) {
					return await updatePost(args.id, args)
				} else {
					throw new Error('Post not found')
				}
			},
		},
		updateMemberType: {
			type: MemberTypeType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				discount: { type: new GraphQLNonNull(GraphQLInt) },
				monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve: async ({ updateMemberType }, args, fastify: FastifyInstance) => {
				const memberType = await fastify.db.memberTypes.findOne({
					key: 'id',
					equals: args.id,
				})
				if (memberType) {
					return await updateMemberType(args.id, args)
				} else {
					throw new Error('Member Type not found')
				}
			},
		},

		subscribe: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (_, args, fastify: FastifyInstance) => {
				const userSubscribed = await fastify.db.users.findOne({
					key: 'id',
					equals: args.userId,
				})
				const user = await fastify.db.users.findOne({
					key: 'id',
					equals: args.id,
				})
				if (!user) throw new Error('User not found')

				if (userSubscribed?.subscribedToUserIds.indexOf(args.id) === -1) {
					userSubscribed?.subscribedToUserIds.push(args.id)
				} else {
					throw new Error('The user is already subscribed')
				}

				return fastify.db.users.change(args.userId, {
					subscribedToUserIds: userSubscribed?.subscribedToUserIds,
				})
			},
		},

		unsubscribe: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (_, args, fastify: FastifyInstance) => {
				const user = await fastify.db.users.findOne({
					key: 'id',
					equals: args.userId,
				})
				let subscribedToUserIds: string[]
				if (user?.subscribedToUserIds.indexOf(args.id) !== -1) {
					subscribedToUserIds = user?.subscribedToUserIds.filter(
						(uId) => uId !== args.id,
					) as string[]
				} else {
					throw new Error('User not in subscriptions')
				}
				return await fastify.db.users.change(args.userId, {
					subscribedToUserIds: subscribedToUserIds,
				})
			},
		},
	}),
})

export const Schema: GraphQLSchema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType,
})
