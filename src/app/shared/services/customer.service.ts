import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { Customer } from '../../interfaces/customer';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  // Initialize Firebase
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  // Create Collection Reference
  customerCollection = collection(this.db, 'customers');

  // Create Customer
  async createCustomer(customer: Customer) {
    try {
      const docRef = await addDoc(this.customerCollection, customer);
      return { ...customer, id: docRef.id };
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Get All Customers
  async getCustomers() {
    try {
      const snapshot = await getDocs(this.customerCollection);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // map through QuerySnapshot and return data with id
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  }

  // Get Customer By ID
  async getCustomerById(id: string) {
    try {
      const docRef = doc(this.db, 'customers', id); // reference to specific document
      const docSnap = await getDoc(docRef); // get document snapshot
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null; // return data with id if document exists
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  }

  // Update Customer
  async updateCustomer(id: string, customer: Partial<Customer>) {
    try {
      const docRef = doc(this.db, 'customers', id);
      await updateDoc(docRef, customer);
      return { id, ...customer };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Delete Customer
  async deleteCustomer(id: string) {
    try {
      const docRef = doc(this.db, 'customers', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
}
