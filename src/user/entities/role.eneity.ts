import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permisson } from "./permission.entity";

@Entity({
    name: "roles"
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        comment: '角色名'
    })
    name: string;


    @ManyToMany(() => Permisson)
    @JoinTable({
        name: "role_permissions"
    })
    permissions: Permisson[]
}