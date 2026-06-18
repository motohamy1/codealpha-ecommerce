export interface Product {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  price: number;
  stock?: number;
  category?: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}
