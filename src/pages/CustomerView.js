import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const CustomerView = () => {
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newActiveStatus, setNewActiveStatus] = useState(false);

  const [reload, setReload] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);

  const { customerId } = useParams();
  const addressRef = useRef(null);
  const storeRef = useRef(null);

  useEffect(() => {
    fetchCustomer();
  }, [reload]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/customer/${customerId}`);
      setCustomer(response.data);
      //setNewName(response.data.customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleCustomerUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("address id : ", addressRef.current.value);
      console.log("store id : ", storeRef.current.value);

      await axios.put(`/customer/${customerId}`, {
        //customer: newName,
        address_id: addressRef.current.value,
        store_id: storeRef.current.value,
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        active: newActiveStatus,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `/address/search?query=${customer.address.address}`
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        `/store/search?query=${customer.store.address.address}`
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleAddressSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/address/search?query=${inputValue.target.value}`
      );
      console.log("addresses:", response.data);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error searching addresses:", error);
      return [];
    }
  };

  const handleStoreSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/store/search?query=${inputValue.target.value}`
      );
      console.log("stores:", response.data);
      setStores(response.data);
    } catch (error) {
      console.error("Error searching stores:", error);
      return [];
    }
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
    fetchAddresses();
    fetchStores();
  };

  return (
    <div>
      {customer ? (
        <div>
          {editMode ? (
            <form onSubmit={handleCustomerUpdate}>
              <DebounceInput
                type="text"
                placeholder="Search..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleAddressSearch} // Handle input change event
              />
              <select ref={addressRef}>
                {addresses.map((address) => (
                  <option key={address.address_id} value={address.address_id}>
                    {address.address}
                  </option>
                ))}
              </select>

              <DebounceInput
                type="text"
                placeholder="Search Store..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleStoreSearch} // Handle input change event
              />
              <select ref={storeRef}>
                {stores.map((store) => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.address.address}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder={customer.first_name}
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder={customer.last_name}
              />
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={customer.email}
              />
              <input
                type="checkbox"
                defaultChecked={newActiveStatus}
                onChange={(e) => setNewActiveStatus(e.target.checked)}
                placeholder={customer.active}
              />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${customer.first_name}, ${customer.last_name}`}</h2>
              <h2>{`${customer.email},  Active: ${!!customer.active}`}</h2>
              <h2>{`${customer.address.address},  Store: ${customer.store.address.address}`}</h2>

              <button onClick={handleEditButtonClick}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CustomerView;
