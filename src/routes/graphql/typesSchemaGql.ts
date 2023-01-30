import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql'
import DB from '../../utils/DB/DB'
import { UserEntity } from '../../utils/DB/entities/DBUsers'

export const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'User data',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
	}),
})

export const ProfileType = new GraphQLObjectType({
	name: 'Profile',
	description: 'Profile data',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		avatar: { type: GraphQLString },
		sex: { type: GraphQLString },
		birthday: { type: GraphQLInt },
		country: { type: GraphQLString },
		street: { type: GraphQLString },
		city: { type: GraphQLString },
		memberType: {
			type: MemberTypeType,
			resolve: async (profile, args, fastify: { db: DB }) => {
				return await fastify.db.memberTypes.findOne({
					key: 'id',
					equals: profile.memberTypeId,
				})
			},
		},
		userId: { type: new GraphQLNonNull(GraphQLID) },
	}),
})

export const PostType = new GraphQLObjectType({
	name: 'Post',
	description: 'Post data',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLString },
		content: { type: GraphQLString },
		userId: { type: GraphQLString },
	}),
})

export const MemberTypeType = new GraphQLObjectType({
	name: 'MemberType',
	description: 'MemberType data',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		discount: { type: GraphQLInt },
		monthPostsLimit: { type: GraphQLInt },
	}),
})

export const UsersWithCompleteInfo = new GraphQLObjectType({
	name: 'UsersWithCompleteInfo',
	description: 'Get users with their posts, profiles, memberTypes',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		subscribedToUserIds: {
			type: new GraphQLList(GraphQLString),
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: async (user, args, fastify: { db: DB }) => {
				return await fastify.db.posts.findMany({
					key: 'userId',
					equals: user.id,
				})
			},
		},
		profile: {
			type: ProfileType,
			resolve: async (user, args, fastify: { db: DB }) => {
				return await fastify.db.profiles.findOne({
					key: 'userId',
					equals: user.id,
				})
			},
		},
	}),
})

const UserWithProfileAndPost = new GraphQLObjectType({
	name: 'UserWithProfile',
	description: 'User with profile',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		profile: {
			type: ProfileType,
			resolve: async (user, args, fastify: { db: DB }) => {
				return await fastify.db.profiles.findOne({
					key: 'userId',
					equals: user.id,
				})
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve: async (user, args, fastify: { db: DB }) => {
				return await fastify.db.posts.findMany({
					key: 'userId',
					equals: user.id,
				})
			},
		},
	}),
})

export const UsersWithSubscribedToWithProfile = new GraphQLObjectType({
	name: 'UsersWithSubscribedToWithProfile',
	description: '2.5 Get users with their userSubscribedTo, profile',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		userSubscribedTo: {
			type: new GraphQLList(UserWithProfileAndPost),
			resolve: async (user: UserEntity, args, fastify: { db: DB }) => {
				async function t() {
					return user.subscribedToUserIds.map((subUser) => {
						return fastify.db.users.findOne({
							key: 'id',
							equals: subUser,
						})
					})
				}
				return await t()
			},
		},
	}),
})

export const UserWithSubscribedToUserWithPost = new GraphQLObjectType({
	name: 'UserWithSubscribedToUserWithPost',
	description: '2.6 Get user by id with his subscribedToUser, posts',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		subscribedToUser: {
			type: new GraphQLList(UserWithProfileAndPost),
			resolve: async (user: UserEntity, args, fastify: { db: DB }) => {
				return await fastify.db.users.findMany({
					key: 'subscribedToUserIds',
					inArray: user.id,
				})
			},
		},
	}),
})

export const TestType = new GraphQLObjectType({
	name: 'Test',
	description: 'User data',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
	}),
})

// const CreatePostType = new GraphQLObjectType({
// 	name: 'CreatePost',
// 	description: 'Create User',
// 	fields: () => ({
// 		firstName: { type: GraphQLString },
// 		lastName: { type: GraphQLString },
// 		email: { type: GraphQLString },
// 	}),
// })
