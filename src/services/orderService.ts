import { OrderRequest } from "../types/customerorderbook";

export const submitOrder = async (orderRequest: OrderRequest): Promise<void> => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    });
    if (!response.ok) {
      throw new Error('Order submission failed');
    }
    console.log('Order submitted successfully');
  } catch (error) {
    console.error('Error submitting order:', error);
  }
};
