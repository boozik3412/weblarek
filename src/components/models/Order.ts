import { IProduct, IOrder, IBuyer } from "../../types/index";

export class Order implements IOrder {
  paymentMethod: string = "";
  address: string = "";
  phone: string = "";
  email: string = "";
  status: string = "";

  constructor() {}


  setPayment(method: string): void {
    this.paymentMethod = method;
  }

  getPayment(): string {
    return this.paymentMethod;
  }

  setStatus(status: string): void {
    this.status = status;
  }

  getStatus(): string {
    return this.status;
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    
    if (!this.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!this.phone) {
      errors.phone = "Phone is required";
    }
    
    if (!this.address) {
      errors.address = "Address is required";
    }
    
    if (!this.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }
    
    return errors;
  }
  


}
