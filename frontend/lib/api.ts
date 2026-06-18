import type { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEMO_USER_ID = "666666666666666666666666";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/product`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: any[] = await res.json();
  return data.map((p) => ({
    ...p,
    id: p._id || p.id,
  }));
}

export async function addToCart(
  productId: string,
  quantity: number,
  unitPrice: number,
): Promise<unknown> {
  const res = await fetch(`${API_URL}/cart/${DEMO_USER_ID}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, unitPrice, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_URL}/cart/${DEMO_USER_ID}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function createProduct(data: FormData | Partial<Product>): Promise<Product> {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to create product");
  }
  return res.json();
}

export async function updateProduct(id: string, data: FormData | Partial<Product>): Promise<Product> {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "PUT",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to update product");
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to delete product");
  }
  return res.json();
}

