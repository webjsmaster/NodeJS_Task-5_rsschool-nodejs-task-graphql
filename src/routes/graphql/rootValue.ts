import DB from '../../utils/DB/DB'
import { PostEntity } from '../../utils/DB/entities/DBPosts'
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles'
import { UserEntity } from '../../utils/DB/entities/DBUsers'

type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>
type CreateProfileDTO = Omit<ProfileEntity, 'id'>
type CreatePostDTO = Omit<PostEntity, 'id'>

export function RootValue(fastify: { db: DB }) {
	const rootValue = {
		getAllPosts: async () => {
			return await fastify.db.posts.findMany()
		},
		getAllProfiles: async () => {
			return await fastify.db.profiles.findMany()
		},
		getAllUsers: async () => {
			return await fastify.db.users.findMany()
		},
		getAllMemberTypes: async () => {
			return await fastify.db.memberTypes.findMany()
		},
		getOneUser: async ({ id }: { id: string }) => {
			return await fastify.db.users.findOne({ key: 'id', equals: id })
		},
		getOnePost: async ({ id }: { id: string }) => {
			return await fastify.db.posts.findOne({ key: 'id', equals: id })
		},
		getOneProfile: async ({ id }: { id: string }) => {
			return await fastify.db.profiles.findOne({ key: 'id', equals: id })
		},
		getOneMemberType: async ({ id }: { id: string }) => {
			return await fastify.db.memberTypes.findOne({ key: 'id', equals: id })
		},
		createUser: async (data: CreateUserDTO) => {
			return await fastify.db.users.create(data)
		},
		createProfile: async (data: CreateProfileDTO) => {
			return await fastify.db.profiles.create(data)
		},
		createPost: async (data: CreatePostDTO) => {
			return await fastify.db.posts.create(data)
		},
	}

	return rootValue
}
