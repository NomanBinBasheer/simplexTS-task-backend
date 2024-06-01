interface AuditFields{
    isDeleted: boolean;
}

export interface IProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    size: string;
    description: string;
    quantity: number;
    image: string;
    priority: number; 
}

export interface IProductWithAudit extends IProduct, AuditFields{}