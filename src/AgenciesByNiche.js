// Import React and other necessary libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './AgenciesByNiche.css'; // Import the CSS file for styling




// Function to group agencies by niche
const groupAgenciesByNiche = (agencies) => {
  return agencies.reduce((groupedAgencies, agency) => {
    const { niche } = agency;
    if (!groupedAgencies[niche]) {
      groupedAgencies[niche] = [];
    }
    groupedAgencies[niche].push(agency);
    return groupedAgencies;
  }, {});
};

// Component for displaying agencies by niche
const AgenciesByNiche = () => {
  const [agencies, setAgencies] = useState([]);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [menuVisible, setMenuVisible] = useState(true);
  const [expandedAgency, setExpandedAgency] = useState(null);
  const [sortBy, setSortBy] = useState('pricing'); // Default sorting option


  useEffect(() => {
    // Fetch data from the API using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/agencies');
        setAgencies(response.data);
        // Set the selected niche to the first niche in the response data
        setSelectedNiche(Object.keys(groupAgenciesByNiche(response.data))[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle niche selection
  const handleNicheClick = (niche) => {
    setSelectedNiche(niche);
    setMenuVisible(false);
    setExpandedAgency(null); // Close the expanded agency when switching niches
  };

  // Function to toggle the expanded state of an agency
  const toggleExpand = (agencyId) => {
    setExpandedAgency((prevExpanded) => (prevExpanded === agencyId ? null : agencyId));
  };

  // Function to handle sorting option change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Function to sort agencies based on the selected option
  const sortAgencies = (a, b) => {
    switch (sortBy) {
      case 'pricing':
        // Convert pricing to integers for numerical comparison
        const priceA = parseInt(a.pricing.replace(/\D/g, ''), 10); // Extract and parse integers
        const priceB = parseInt(b.pricing.replace(/\D/g, ''), 10); // Extract and parse integers
        return priceA - priceB;
      case 'review':
        return b.reviews - a.reviews;
      case 'latest':
        return b.id - a.id; // Assuming a higher ID means a more recent agency
      default:
        return 0;
    }
  };

  return (
    <div className="agencies-container">
      <div className={`menu-container ${menuVisible ? 'visible' : ''}`}>
        <h1 className="title">Niche Menu</h1>
        <ul className="niche-menu">
          {Object.keys(groupAgenciesByNiche(agencies)).map((niche) => (
            <li key={niche} className={selectedNiche === niche ? 'active' : ''} onClick={() => handleNicheClick(niche)}>
              {niche}
            </li>
          ))}
        </ul>
        <div className="filter-container">
          <label htmlFor="sortBy">Sort by:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange}>
            <option value="pricing">Pricing</option>
            <option value="review">Review</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>
      <div className="agencies-list-container">
        <h1 className="title">Agencies by Niche</h1>
        <div className="niche-container">
          <h2 className="niche-title">{selectedNiche}</h2>
          <ul className="agency-list">
            {groupAgenciesByNiche(agencies)[selectedNiche]?.sort(sortAgencies).map((agency) => (
              <li key={agency.id} className={`agency-item ${expandedAgency === agency.id ? 'expanded' : ''}`} onClick={() => toggleExpand(agency.id)}>
                <strong>{agency.name}</strong>
                <strong className="reviews"> ⭐{agency.reviews}</strong>
                {expandedAgency === agency.id && (
                  <div className="agency-info">
                    <p>{agency.description}</p>
                    <p><strong>Pricing:</strong> {agency.pricing}</p>
                    <p><strong>Reviews:</strong> {agency.reviews}</p>
                    <p><strong>Phone:</strong> <tel>{agency.phoneNumber}</tel></p>
                    <p><strong>Email:</strong> <a href={`mailto:${agency.email}`}>{agency.email}</a></p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div> 
    </div>
  );
};

// Export the component
export default AgenciesByNiche;
