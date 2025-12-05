export type User = {
    user_id: number;
    firstName: string;
    secondName: string;
    email: string;
    color:string;
}

export type Company = {
    company_id: number;
    name: string;
    owner_id:number;
}

export type User_company = {
    user_id: number;
    company_id: number;
}

export type Task_types = {
    type_id: string;
    type_name: string;
    idx:number;
    user_id:number;
}
export type Task = {
    task_id: string;
    user_id: number;
    type_id: string;
    title: string;
    date:Date;
    description: string;
    idx: number;
    company_id:number;
    tag_id:string;
    tag_name?:string;
    color?:string;
}
export type Tag = {
    tag_id:string;
    tag_name:string;
    color:string;
} 

export type User_name = {
    firstName:string;
    secondName:string;
    color:string;
}