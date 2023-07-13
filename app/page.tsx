import { revalidateTag } from "next/cache";

export interface Product {
  id?: number;
  product: string;
  price: string;
}

export default async function Home() {
  const res = await fetch(
    "https://64afb885c60b8f941af47b28.mockapi.io/products",
    {
      cache: "no-cache",
      next: {
        tags: ["products"],
      },
    }
  );

  const products: Product[] = await res.json();

  const addProductToDatabase = async (e: FormData) => {
    "use server";
    const product = e.get("product")?.toString();
    const price = e.get("price")?.toString();

    if (!product || !price) return;

    const newProduct: Product = {
      product,
      price,
    };

    await fetch("https://64afb885c60b8f941af47b28.mockapi.io/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidateTag("products");
  };

  return (
    <main className="">
      <h1 className="text-3xl font-bold text-center">Product Warehouse</h1>
      <form
        action={addProductToDatabase}
        className="flex flex-col gap-5 max-w-xl mx-auto p-5"
      >
        <input
          name="product"
          placeholder="Enter Product name"
          type="text"
          className="border border-gray-300 p-2 rounded-md"
        />
        <input
          name="price"
          placeholder="Enter Product price"
          type="text"
          className="border border-gray-300 p-2 rounded-md"
        />
        <button className="border bg-blue-500 text-white p-2 rounded-md">
          Add product
        </button>
      </form>
      <div className="flex flex-wrap gap-5">
        {products.map((product) => (
          <div key={product.id} className="p-5 shadow">
            <p>{product.product}</p>
            <p>$ {product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
