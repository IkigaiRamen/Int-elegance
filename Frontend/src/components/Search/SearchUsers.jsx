import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import TeamCard from './SearchCard';  // Assuming this is for users
import CompanyCard from './CompanyCard';  // Assuming you have a separate CompanyCard component
import { searchUsers } from '../../services/UserService';  // Adjust this to use your updated service

const SearchUsers = () => {
  const [queryParams] = useSearchParams(); 
  const query = queryParams.get('query') || ''; 
  const [users, setUsers] = useState([]); 
  const [companies, setCompanies] = useState([]);  // New state to store companies
  const [error, setError] = useState('');

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (query) { 
          const results = await searchUsers(query); 
          
          // Check if users and companies exist and are arrays
          if (results.users && Array.isArray(results.users)) {
            setUsers(results.users);
          } else {
            setUsers([]);  // Set an empty array if undefined or not an array
          }

          if (results.companies && Array.isArray(results.companies)) {
            setCompanies(results.companies);
          } else {
            setCompanies([]);  // Set an empty array if undefined or not an array
          }

          setError(''); 
        } else {
          setUsers([]); 
          setCompanies([]); 
        }
      } catch (err) {
        setError(err.message); 
      }
    };

    handleSearch(); 
  }, [query]); 

  return (
    <div className="container-xl">
      <div className="card-header p-0 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
        <h4 className="search-results-title">Search Results</h4>
      </div>
      <div className="search-users-container">
        {error && <p className="error-message">{error}</p>} 
        
        <h5>Users</h5>
        <div className="users-list">
          {users.length > 0 ? (
            users.map((user) => (
              <TeamCard key={user._id} user={user} />
            ))
          ) : (
            <p className="no-users-message">No users found</p>
          )}
        </div>

        <h5>Companies</h5>
        <div className="users-list">
          {companies.length > 0 ? (
            companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))
          ) : (
            <p className="no-companies-message">No companies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
