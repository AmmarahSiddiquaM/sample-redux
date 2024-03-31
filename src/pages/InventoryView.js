import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const InventoryView = () => {
  const [inventory, setInventory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  //const [newName, setNewName] = useState("");
  const [reload, setReload] = useState(false);
  const [films, setFilms] = useState([]);
  const [stores, setStores] = useState([]);

  const { inventoryId } = useParams();
  const filmRef = useRef(null);
  const storeRef = useRef(null);

  useEffect(() => {
    fetchInventory();
  }, [reload]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`/inventory/${inventoryId}`);
      setInventory(response.data);
      //setNewName(response.data.inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleInventoryUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("film id : ", filmRef.current.value);
      console.log("store id : ", storeRef.current.value);

      await axios.put(`/inventory/${inventoryId}`, {
        //inventory: newName,
        film_id: filmRef.current.value,
        store_id: storeRef.current.value,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const fetchFilms = async () => {
    try {
      const response = await axios.get(
        `/film/search?query=${inventory.film.title}`
      );
      setFilms(response.data);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        `/store/search?query=${inventory.store.address.address}`
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleFilmSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/film/search?query=${inputValue.target.value}`
      );
      console.log("films:", response.data);
      setFilms(response.data);
    } catch (error) {
      console.error("Error searching films:", error);
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
    fetchFilms();
    fetchStores();
  };

  return (
    <div>
      {inventory ? (
        <div>
          {editMode ? (
            <form onSubmit={handleInventoryUpdate}>
              <DebounceInput
                type="text"
                placeholder="Search..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleFilmSearch} // Handle input change event
              />
              <select ref={filmRef}>
                {films.map((film) => (
                  <option key={film.film_id} value={film.film_id}>
                    {film.title}
                  </option>
                ))}
              </select>

              <DebounceInput
                type="text"
                placeholder="Search..."
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

              {/* <input
                type="text"
                placeholder={inventory.inventory}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              /> */}
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${inventory.film.title}, ${inventory.store.address.address}`}</h2>
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

export default InventoryView;
