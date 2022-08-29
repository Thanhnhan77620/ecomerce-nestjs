import { Status } from './../../statuses/entities/status.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './../../files/entities/file.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  logo: FileEntity;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  image: FileEntity;

  @Column()
  description: string | null;

  @Column()
  totalProduct: number;

  @Column()
  slug: string;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  status: Status;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    this.slug = `${this.name.split(' ').join('_')}_${this.id}`;
  }
}
