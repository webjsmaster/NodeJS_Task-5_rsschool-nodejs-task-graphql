import DB from '../../utils/DB/DB'
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes'
import { PostEntity } from '../../utils/DB/entities/DBPosts'
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles'
import { UserEntity } from '../../utils/DB/entities/DBUsers'

type CreateUserDTO = Omit<UserEntity, 'id' | 'subscribedToUserIds'>
type CreateProfileDTO = Omit<ProfileEntity, 'id'>
type CreatePostDTO = Omit<PostEntity, 'id'>

type ChangeUserDTO = Partial<Omit<UserEntity, 'id'>>
type ChangeProfileDTO = Partial<Omit<ProfileEntity, 'id' | 'userId'>>
type ChangePostDTO = Partial<Omit<PostEntity, 'id' | 'userId'>>
type ChangeMemberTypeDTO = Partial<Omit<MemberTypeEntity, 'id'>>

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
		updateUser: async (id: string, data: ChangeUserDTO) => {
			return await fastify.db.users.change(id, data)
		},
		updateProfile: async (id: string, data: ChangeProfileDTO) => {
			return await fastify.db.profiles.change(id, data)
		},
		updatePost: async (id: string, data: ChangePostDTO) => {
			return await fastify.db.posts.change(id, data)
		},
		updateMemberType: async (id: string, data: ChangeMemberTypeDTO) => {
			return await fastify.db.memberTypes.change(id, data)
		},
	}

	return rootValue
}
