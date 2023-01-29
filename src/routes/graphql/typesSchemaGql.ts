import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql'
import DB from '../../utils/DB/DB'

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
		memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
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
		userId: { type: new GraphQLList(GraphQLString) },
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
		subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
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

// const CreatePostType = new GraphQLObjectType({
// 	name: 'CreatePost',
// 	description: 'Create User',
// 	fields: () => ({
// 		firstName: { type: GraphQLString },
// 		lastName: { type: GraphQLString },
// 		email: { type: GraphQLString },
// 	}),
// })
