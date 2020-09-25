import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated
} from 'typeorm'

@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Generated('uuid')
  token: string

  @Column()
  user_id: string

  @Column({ default: true })
  valid: boolean

  @CreateDateColumn()
  created_at: number

  @UpdateDateColumn()
  updated_at: number
}

export default UserToken
