export type User = {
    user_id: number;
    name: string;
    email: string;
}

export type Company = {
    company_id: number;
    name: string;
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

export type Task_types_alignment={
    id:number;
}

export type Task = {
    task_id: string;
    user_id: number;
    type_id: string;
    title: string;
    description: string;
    idx: number;
}