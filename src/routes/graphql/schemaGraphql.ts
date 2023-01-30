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
	TestType,
	UsersWithCompleteInfo,
	UsersWithSubscribedToWithProfile,
	UserType,
	UserWithSubscribedToUserWithPost,
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
		usersWithSubscribedToWithProfile: {
			type: new GraphQLNonNull(
				new GraphQLList(new GraphQLNonNull(UsersWithSubscribedToWithProfile)),
			),
			resolve: async ({ getAllUsers }) => {
				return await getAllUsers()
			},
		},

		userWithSubscribedToUserWithPost: {
			type: new GraphQLNonNull(UserWithSubscribedToUserWithPost),
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
		test: {
			type: TestType,
			resolve: async (root, args, fastify: FastifyInstance) => {
				const user1 = await fastify.db.users.create({
					email: 'test',
					firstName: '1',
					lastName: '1',
				})
				const user2 = await fastify.db.users.create({
					email: 'test',
					firstName: '2',
					lastName: '2',
				})
				const user3 = await fastify.db.users.create({
					email: 'test',
					firstName: '3',
					lastName: '3',
				})

				await fastify.db.users.change(user2.id, {
					subscribedToUserIds: [user1.id, user2.id],
				})

				await fastify.db.users.change(user3.id, {
					subscribedToUserIds: [user1.id, user2.id],
				})

				await fastify.db.profiles.create({
					userId: user2.id,
					avatar: 'test',
					birthday: 34,
					city: 'test',
					country: 'test',
					memberTypeId: 'basic',
					sex: 'test',
					street: 'tset',
				})
				await fastify.db.profiles.create({
					userId: user1.id,
					avatar: 'test',
					birthday: 34,
					city: 'test',
					country: 'test',
					memberTypeId: 'basic',
					sex: 'test',
					street: 'tset',
				})
				await fastify.db.profiles.create({
					userId: user3.id,
					avatar: 'test',
					birthday: 34,
					city: 'test',
					country: 'test',
					memberTypeId: 'basic',
					sex: 'test',
					street: 'tset',
				})

				await fastify.db.posts.create({
					content: 'bla=bal-bal',
					title: 'Post#1',
					userId: user1.id,
				})

				await fastify.db.posts.create({
					content: 'bla=bal-bal',
					title: 'Post#2',
					userId: user2.id,
				})
				await fastify.db.posts.create({
					content: 'bla=bal-bal',
					title: 'Post#3',
					userId: user2.id,
				})
				await fastify.db.posts.create({
					content: 'bla=bal-bal',
					title: 'Post#4',
					userId: user3.id,
				})
			},
		},
	}),
})

export const Schema: GraphQLSchema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType,
	//types: [UserType],
})

//usersWithSubscribedToWithProfile,
//В 2.5 нужно вернуть массив Profile тех user у которых в поле subscribedToUserIds есть id запрашиваемого пользователя...
//Должны быть посты тех, кто подписан на меня, ну или на запрашиваемого пользователя)
//А вот в 2.7  уже возвращаем user(ов) по этим 2м критериям userSubscribedTo subscribedToUser
//2.5 - список всех юзеров, для каждого юзера включить список его подписок и его профиль.
//2.6 - один юзер по айди, со списком его подписчиков и списком его постов
