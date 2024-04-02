import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const StaffView = () => {
  const [staff, setStaff] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");

  const [reload, setReload] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);

  const { staffId } = useParams();
  const addressRef = useRef(null);
  const storeRef = useRef(null);

  useEffect(() => {
    fetchStaff();
  }, [reload]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`/staff/${staffId}`);
      setStaff(response.data);
      //setNewName(response.data.staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleStaffUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("address id : ", addressRef.current.value);
      console.log("store id : ", storeRef.current.value);

      await axios.put(`/staff/${staffId}`, {
        //staff: newName,
        address_id: addressRef.current.value,
        store_id: storeRef.current.value,
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        username: newUserName,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `/address/search?query=${staff.address.address}`
      );
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        `/store/search?query=${staff.store.address.address}`
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
      {staff ? (
        <div>
          {editMode ? (
            <form onSubmit={handleStaffUpdate}>
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
                placeholder={staff.first_name}
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder={staff.last_name}
              />
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={staff.email}
              />
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder={staff.username}
              />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${staff.first_name}, ${staff.last_name}`}</h2>
              <h2>{`${staff.email},  Username: ${staff.username}`}</h2>
              <h2>{`${staff.address.address}, Store: ${staff.store.address.address}`}</h2>

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

export default StaffView;
