// src/DataViewer.tsx

import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './DataViewer.css';

const DataViewer: React.FC = () => {
  // States for user data and filters
  const [allUserData, setAllUserData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Filter states for each attribute
  const [filteremail, setFilteremail] = useState('');
  const [filterNumberOfCases, setFilterNumberOfCases] = useState('');
  const [filterStrengths, setFilterStrengths] = useState('');
  const [filterWeaknesses, setFilterWeaknesses] = useState('');
  const [filterPreferredCaseTypes, setFilterPreferredCaseTypes] = useState('');
  const [filterTimezone, setFilterTimezone] = useState('');
  const [filterPreferredDifficulty, setFilterPreferredDifficulty] = useState('');

  // Assume these options are the same as in UserProfile.tsx
  const strengthsOptions = ['Framework', 'Public Math', 'Brainstorming', 'Clearing Chart', 'Time Utilization', 'Clarifying Questions', 'Speaking Speed'];
  const weaknessesOptions = [...strengthsOptions]; // Assuming the same options for weaknesses
  const caseTypes = ['Profitability', 'Market Entry', 'Pricing', 'Acquisition', 'Operations', 'Human Resources', 'Non-traditional'];
  const difficultyLevels = ['Easy', 'Medium', 'Difficult'];
  const timezoneOptions = ['EST', 'CST', 'MST', 'PST']; // Replace with actual timezone options
  const caseOptions = ["<10", "11-20", "21-30", "31-40", ">40"];

  // ... useEffect to fetch data

  // ... useEffect for filter application

  // Filter Header component
  const FilterHeader = ({ column, filterState, setFilterState, options }: any) => {
    return (
      <th>
        {column}
        {options ? (
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)}>
            <option value="">All</option>
            {options.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          // If no options provided, it means it's a text input
          <input
            type="text"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            placeholder={`Search ${column.toLowerCase()}`}
          />
        )}
      </th>
    );
  };


    // ... states and other functions ...
  
    // Function to handle rendering of strengths and weaknesses
    const renderArrayOrEmpty = (array: string[] | null) => {
      // If array is null or not an array, return an empty string
      if (!array || !Array.isArray(array)) {
        return '';
      }
      // Otherwise, join the array elements with a comma
      return array.join(', ');
    };

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'userProfiles/');
  
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data:", data); // Debug: Log fetched data
      if (data) {
        const userList = Object.values(data);
        setAllUserData(userList);
        setFilteredData(userList); // Initially set all data to be displayed
      }
    });
  }, []);
  
  useEffect(() => {
    const filtered = applyFilters(allUserData);
    console.log("Filtered data:", filtered); // Debug: Log filtered data
    setFilteredData(filtered);
  }, [/* ... dependencies ... */]);
  
  // Apply all filters to data
// Apply all filters to data
  const applyFilters = (data: any[]) => {
    return data.filter(user => {
      const filterByemail = filteremail ? user.email.toLowerCase().includes(filteremail.toLowerCase()) : true;
      const filterByNumberOfCases = filterNumberOfCases ? user.numberOfCases === filterNumberOfCases : true;
      const filterByStrengths = filterStrengths ? user.strengths && user.strengths.includes(filterStrengths) : true;
      const filterByWeaknesses = filterWeaknesses ? user.weaknesses && user.weaknesses.includes(filterWeaknesses) : true;
      const filterByPreferredCaseTypes = filterPreferredCaseTypes ? user.preferredCaseTypes && user.preferredCaseTypes.includes(filterPreferredCaseTypes) : true;
      const filterByTimezone = filterTimezone ? user.timezone === filterTimezone : true;
      const filterByPreferredDifficulty = filterPreferredDifficulty ? user.preferredDifficulty === filterPreferredDifficulty : true;
  
      return filterByemail && filterByNumberOfCases && filterByStrengths && filterByWeaknesses && filterByPreferredCaseTypes && filterByTimezone && filterByPreferredDifficulty;
    });
  };
  
  useEffect(() => {
    const filtered = applyFilters(allUserData);
    console.log("Filtered data:", filtered); // Debug: Log filtered data
    setFilteredData(filtered);
  }, [allUserData, filteremail, filterNumberOfCases, filterStrengths, filterWeaknesses, filterPreferredCaseTypes, filterTimezone, filterPreferredDifficulty]);
  

  // Render the component
  return (
    <div>
      <h1>Data Viewer</h1>
      <table className="data-table">
        <thead>
          <tr>
          <th>
              Email
              <input
                type="text"
                value={filteremail}
                onChange={(e) => setFilteremail(e.target.value)}
                placeholder="Search email"
              />
            </th>
            {/* Removed the Name filter */}
            <FilterHeader column="Number of Cases" filterState={filterNumberOfCases} setFilterState={setFilterNumberOfCases} options={caseOptions} />
            <FilterHeader column="Strengths" filterState={filterStrengths} setFilterState={setFilterStrengths} options={strengthsOptions} />
            <FilterHeader column="Weaknesses" filterState={filterWeaknesses} setFilterState={setFilterWeaknesses} options={weaknessesOptions} />
            <FilterHeader column="Preferred Case Types" filterState={filterPreferredCaseTypes} setFilterState={setFilterPreferredCaseTypes} options={caseTypes} />
            <FilterHeader column="Timezone" filterState={filterTimezone} setFilterState={setFilterTimezone} options={timezoneOptions} />
            <FilterHeader column="Preferred Difficulty" filterState={filterPreferredDifficulty} setFilterState={setFilterPreferredDifficulty} options={difficultyLevels} />
            {/* ... other filter headers */}
          </tr>
        </thead>
        <tbody>
        {filteredData.map((user, index) => (
            <tr key={index}>
        <td>{user.email}</td>
        <td>{user.numberOfCases}</td>
        <td>{renderArrayOrEmpty(user.strengths)}</td> {/* Assuming strengths is an array */}
        <td>{renderArrayOrEmpty(user.weaknesses)}</td> {/* Assuming weaknesses is an array */}
        <td>{renderArrayOrEmpty(user.preferredCaseTypes)}</td> {/* Assuming preferredCaseTypes is an array */}
        <td>{user.timezone}</td>
        <td>{user.preferredDifficulty}</td>
            </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default DataViewer;
