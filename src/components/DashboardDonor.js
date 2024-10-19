import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';

const Dashboard = () => {
    const [currentDonations, setCurrentDonations] = useState([]);
    const [donatedProducts, setDonatedProducts] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', image: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAddingItem, setIsAddingItem] = useState(false); // Flag for adding item

    useEffect(() => {
        const unsubscribeCurrent = onSnapshot(collection(db, 'currentDonations'), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCurrentDonations(items);
        });

        const unsubscribeDonated = onSnapshot(collection(db, 'donatedProducts'), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonatedProducts(items);
        });

        return () => {
            unsubscribeCurrent();
            unsubscribeDonated();
        };
    }, []);

    const handleAddItem = async () => {
        if (isAddingItem) return; // Prevent adding if already adding
        setIsAddingItem(true); // Set flag to true
        await addDoc(collection(db, 'currentDonations'), newItem);
        resetNewItem();
        setIsAddingItem(false); // Reset flag
    };

    const updateItem = async () => {
        const itemDoc = doc(db, 'currentDonations', editingItem.id);
        await updateDoc(itemDoc, { name: editingItem.name, quantity: editingItem.quantity, image: editingItem.image });
        setCurrentDonations(currentDonations.map(item => item.id === editingItem.id ? editingItem : item));
        closeModal();
    };

    const handleDeleteItem = async (id) => {
        try {
            const itemDoc = doc(db, 'currentDonations', id);
            await deleteDoc(itemDoc);
            setCurrentDonations(currentDonations.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleDeleteReservedItem = async (id) => {
        try {
            const itemDoc = doc(db, 'donatedProducts', id);
            await deleteDoc(itemDoc);
        } catch (error) {
            console.error("Error deleting reserved item:", error);
        }
    };
    

    const handleDonate = async (item) => {
        const existingDonation = donatedProducts.find(donated => 
            donated.name === item.name && donated.quantity === item.quantity
        );

        if (!existingDonation) {
            const docRef = await addDoc(collection(db, 'donatedProducts'), { 
                ...item, 
                date: Timestamp.fromDate(new Date()) 
            });

            // Add the new donation to local state
        }

        handleDeleteItem(item.id);
    };

    const resetNewItem = () => {
        setNewItem({ name: '', quantity: '', image: '' });
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingItem(null);
    };

    return (
        <div style={styles.dashboard}>
            <div style={styles.currentDonations}>
                <h2>Up for grabs</h2>
                <button onClick={() => setModalVisible(true)}>Add donation</button>
                <div style={styles.grid}>
                    {currentDonations.map(product => (
                        <div key={product.id} style={styles.item}>
                            <img src={product.image} alt={product.name} style={styles.image} />
                            <div style={styles.itemInfo}>
                                <h4>{product.name}</h4>
                                <p>Quantity: {product.quantity}</p>
                            </div>
                            <div style={styles.buttons}>
                                <button style={styles.button} onClick={() => { setEditingItem(product); setModalVisible(true); }}>Edit</button>
                                <button style={styles.button} onClick={() => handleDonate(product)}>Donate</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.donatedProducts}>
                <h2>Reserved Items</h2>
                <div style={styles.grid}>
                    {donatedProducts.map(product => (
                        <div key={product.id} style={styles.item}>
                            <img src={product.image} alt={product.name} style={styles.image} />
                            <div style={styles.itemInfo}>
                                <h4>{product.name}</h4>
                                <p>Quantity: {product.quantity}</p>
                                <p>Donated on: {product.date && new Date(product.date.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                            <div style={styles.buttons}>
                                <button style={styles.button} onClick={() => { setEditingItem(product); setModalVisible(true); }}>Edit</button>
                                <button style={styles.button} onClick={() => handleDeleteReservedItem(product.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    
            {modalVisible && (
                <div style={styles.modal}>
                    <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={editingItem ? editingItem.name : newItem.name} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })} 
                    />
                    <input 
                        type="number" 
                        placeholder="Quantity" 
                        value={editingItem ? editingItem.quantity : newItem.quantity} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, quantity: e.target.value }) : setNewItem({ ...newItem, quantity: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Image URL" 
                        value={editingItem ? editingItem.image : newItem.image} 
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, image: e.target.value }) : setNewItem({ ...newItem, image: e.target.value })} 
                    />
                    <button onClick={async () => {
                        if (editingItem) {
                            await updateItem();
                        } else {
                            await handleAddItem();
                        }
                        closeModal();
                    }}>Save</button>
                    <button onClick={closeModal}>Cancel</button>
                    {editingItem && <button onClick={() => { handleDeleteItem(editingItem.id); closeModal(); }}>Delete</button>}
                </div>
            )}
        </div>
    );    
};

// Styles
const styles = {
    dashboard: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '20px',
        backgroundColor: '#f4f4f4',
    },
    currentDonations: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#e0f7fa',
        marginBottom: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    donatedProducts: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#ffecb3',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
    },
    item: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    image: {
        width: '100%',
        height: 'auto',
        maxHeight: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    itemInfo: {
        margin: '10px 0',
    },
    buttons: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: '5px',
    },
    button: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        transition: 'background-color 0.3s',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        zIndex: '1000',
        borderRadius: '8px',
    },
};

export default Dashboard;
