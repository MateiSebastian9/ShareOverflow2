// HomePage.js
import React, { useState } from 'react';

const HomePage = () => {
  return (
    <div>
      <div style={styles.container}>
        <h1>Welcome to ShareOverflow</h1>
        <p>Your go-to platform for sharing knowledge.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
};

export default HomePage;
