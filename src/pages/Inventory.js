import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  //const [newInventoryName, setNewInventoryName] = useState("");
  //const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [films, setFilms] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchInventories();
  }, [currentPage]); // Refetch inventories when currentPage changes

  const navigate = useNavigate();
  //const newInventoryNameRef = useRef(null);
  const filmRef = useRef(null);
  const storeRef = useRef(null);

  const fetchInventories = async () => {
    try {
      const response = await axios.get(`/inventory?page=${currentPage}`);
      setInventories(response.data.inventories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  const handleCreateInventory = async () => {
    try {
      await axios.post("/inventory", {
        //inventory: newInventoryName,
        film_id: filmRef.current.value,
        store_id: storeRef.current.value,
      });
      //setNewInventoryName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new inventory
    } catch (error) {
      console.error("Error creating inventory:", error);
    }
  };

  const handleDeleteInventory = async (inventoryId) => {
    try {
      await axios.delete(`/inventory/${inventoryId}`);
      //fetchInventories(); // Refresh inventory list
      setCurrentPage(1); // Reset to first page after deleting a  inventory
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  // const handleUpdateInventory = async () => {
  //   try {
  //     await axios.put(`/inventory/${selectedInventoryId}`, {
  //       //inventory: newInventoryNameRef.current.value,
  //       film_id: filmRef.current.value,
  //       store_id: storeRef.current.value,
  //     });
  //     setSelectedInventoryId(null);
  //     fetchInventories(); // Refresh inventory list
  //   } catch (error) {
  //     console.error("Error updating inventory:", error);
  //   }
  // };

  const handleNavigateInventory = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchFilms = async () => {
    try {
      const response = await axios.get("/film");
      setFilms(response.data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const handleFetchStores = async () => {
    try {
      const response = await axios.get("/store");
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error fetching store:", error);
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
      console.error("Error searching films:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchFilms(); // Fetch films when creating a new inventory
    handleFetchStores(); // Fetch stores when creating a new inventory

    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Inventory Page</h1>
          <h2>Inventories</h2>

          <ul>
            {inventories.map((inventory) => (
              <li key={inventory.inventory_id}>
                {/* {selectedInventoryId === inventory.inventory_id ? (
                  <>
                    <input
                      type="text"
                      ref={newInventoryNameRef}
                      placeholder={inventory.inventory}
                    />
                    <button
                      onClick={() => {
                        handleUpdateInventory();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${inventory.film.title}, ${inventory.store.address.address}`}
                  {/* {inventory.inventory} {inventory.film.film} */}
                  <button
                    onClick={() =>
                      handleNavigateInventory(inventory.inventory_id)
                    }
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteInventory(inventory.inventory_id)
                    }
                  >
                    Delete
                  </button>
                  {/* <button
                      onClick={() =>
                        setSelectedInventoryId(inventory.inventory_id)
                      }
                    >
                      Edit
                    </button> */}
                </>
                {/* )} */}
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              // Display only a subset of page numbers around the current page
              if (
                page === 1 ||
                page === currentPage ||
                page === totalPages ||
                Math.abs(currentPage - page) <= 2
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(page)}
                    disabled={currentPage === page}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>

          {/* <button onClick={() => setShowCreateForm(true)}>
            Create New Inventory
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Inventory</button>
        </>
      ) : (
        <>
          <h2>Create Inventory</h2>

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
            value={newInventoryName}
            onChange={(e) => setNewInventoryName(e.target.value)}
            placeholder="Enter inventory name"
          /> */}
          <button onClick={handleCreateInventory}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Inventory;
