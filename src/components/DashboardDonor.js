import React from 'react';

// Sample data for products
const currentDonations = [
    { id: 1, name: 'Canned Beans', quantity: 20 },
    { id: 2, name: 'Rice', quantity: 15 },
];

const donatedProducts = [
    { id: 1, name: 'Pasta', quantity: 30, date: '2024-10-01' },
    { id: 2, name: 'Cooking Oil', quantity: 10, date: '2024-10-10' },
];

const Dashboard = () => {
    return (
        <div style={styles.dashboard}>
            <h1 style={styles.title}>Donation Dashboard</h1>
            <div style={styles.section}>
                <h2>Current Products Up for Donation</h2>
                <ul style={styles.list}>
                    {currentDonations.map(product => (
                        <li key={product.id} style={styles.listItem}>
                            {product.name} - Quantity: {product.quantity}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={styles.section}>
                <h2>Already Donated Products</h2>
                <ul style={styles.list}>
                    {donatedProducts.map(product => (
                        <li key={product.id} style={styles.listItem}>
                            {product.name} - Quantity: {product.quantity} (Donated on: {product.date})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    dashboard: {
        padding: '20px',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '30px',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        backgroundColor: '#fff',
        margin: '10px 0',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
};

export default Dashboard;
