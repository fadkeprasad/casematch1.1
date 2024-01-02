// src/UserProfile.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone'; // make sure to have installed moment-timezone
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';


const strengthsOptions = ['Framework', 'Public Math', 'Brainstorming', 'Clearing Chart', 'Time Utilization', 'Clarifying Questions', 'Speaking Speed'];
const weaknessesOptions = [...strengthsOptions]; // Assuming the same options for weaknesses
const caseTypes = ['Profitability', 'Market Entry', 'Pricing', 'Acquisition', 'Operations', 'Human Resources', 'Non-traditional'];
const difficultyLevels = ['Easy', 'Medium', 'Difficult'];


const UserProfile: React.FC = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const [email, setemail] = useState('');
  const [caseLog, setCaseLog] = useState('');
  const [numberOfCases, setNumberOfCases] = useState('');
  const [timezone, setTimezone] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [preferredCaseTypes, setPreferredCaseTypes] = useState<string[]>([]);
  const [preferredDifficulty, setPreferredDifficulty] = useState('');

  const saveProfile = async () => {
    const auth = getAuth();

    if (currentUser) {
      // Proceed with saving the profile data
      const userProfileRef = ref(db, 'userProfiles/' + currentUser.uid);
      try {
        await set(userProfileRef, {
          // Your profile data here
        });
        // Handle successful save, perhaps navigate to a different page or show confirmation
      } catch (error) {
        // Handle any errors that occur during save
        console.error("Error saving profile: ", error);
      }
    } else {
      // The user is not authenticated, handle accordingly, perhaps:
      console.error("User is not authenticated.");
      // Redirect to sign-in page or show an error message
    }
  };


  const saveUserData = () => {
    
    if (currentUser) {
      const db = getDatabase();
      const userId = currentUser.uid;
      const userPreferencesRef = ref(db, 'users/' + userId);
      const processedStrengths = strengths.length > 0 ? strengths : null;
      const processedWeaknesses = weaknesses.length > 0 ? weaknesses : null;
      const processedPreferredCaseTypes = preferredCaseTypes.length > 0 ? preferredCaseTypes : null;
      const processedNumberOfCases = numberOfCases || null;
      const processedPreferredDifficulty = preferredDifficulty || null;

      set(userPreferencesRef, {
        Email: email || null,
        caseLog: caseLog || null,
        numberOfCases: processedNumberOfCases,
        timezone: timezone || null,
        strengths: processedStrengths,
        weaknesses: processedWeaknesses,
        preferredCaseTypes: processedPreferredCaseTypes,
        preferredDifficulty: processedPreferredDifficulty
      }).then(() => {
        // Data saved successfully
        console.log('User preferences saved.');
      }).catch((error) => {
        // The write failed...
        console.error('Error writing user preferences:', error);
      });
    }
  };


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
        const userProfileRef = ref(db, 'userProfiles/' + user.uid);
        onValue(userProfileRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setemail(data.email || '');
            setCaseLog(data.caseLog || '');
            setNumberOfCases(data.numberOfCases || '');
            setTimezone(data.timezone || '');
            setStrengths(data.strengths || []);
            setWeaknesses(data.weaknesses || []);
            setPreferredCaseTypes(data.preferredCaseTypes || []);
            setPreferredDifficulty(data.preferredDifficulty || '');
          } else {
            setTimezone(moment.tz.guess()); // Setting the timezone if user profile is not found
          }
        });
      } else {
        setIsUserAuthenticated(false);
        navigate('/signin');
      }
    }); // This is the correct place for the closing parenthesis
  
    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [navigate, db]); // Removed `user` from the dependency array
  

  // Load existing profile data from your backend here...



  const handleCheckboxChange = (option: string, selectedOptions: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedOptions.includes(option)) {
      setter(selectedOptions.filter((o) => o !== option));
    } else {
      setter([...selectedOptions, option]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentUser) {
      const userProfileRef = ref(db, 'userProfiles/' + currentUser.uid);
      set(userProfileRef, {
        email,
        caseLog,
        numberOfCases,
        timezone,
        strengths,
        weaknesses,
        preferredCaseTypes,
        preferredDifficulty,
      }).then(() => {
        // Data saved successfully!
        alert('Profile saved!');
      }).catch((error) => {
        // The write failed...
        alert('An error occurred while saving the profile!');
        console.error(error);
      });
    }
  };

  
  const formFieldStyle = {
    marginBottom: '15px', // Slightly reduced bottom margin
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'start',
    width: '100%' // Ensures fields use the full width of the container
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: 'darkblue',
    marginBottom: '10px'
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    marginBottom: '15px'
  };

  const buttonStyle = {
    backgroundColor: 'darkblue',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const containerStyle = {
    maxWidth: '800px', // Increased maxWidth for more space
    margin: '20px auto', // Centered with automatic horizontal margins
    padding: '20px',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  };
  

  useEffect(() => {
    // Set the default timezone
    setTimezone(moment.tz.guess());
  }, []);


  return (
    <div style={containerStyle}>
      <h1 style={{ color: 'darkblue', textAlign: 'center' }}>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Email:
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setemail(e.target.value)} 
              maxLength={50} 
              style={inputStyle} 
            />
          </label>
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Case Log URL:
            <input 
              type="url" 
              value={caseLog} 
              onChange={(e) => setCaseLog(e.target.value)} 
              style={inputStyle} 
            />
          </label>
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Number of Cases:
            <select 
              value={numberOfCases} 
              onChange={(e) => setNumberOfCases(e.target.value)}
              style={inputStyle}
            >
              <option value="<10">Fewer than 10</option>
              <option value="11-20">11-20</option>
              <option value="21-30">21-30</option>
              <option value="31-40">31-40</option>
              <option value=">40">Greater than 40</option>
              {/* ... other options */}
            </select>
          </label>
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Timezone:
            <select 
              value={timezone} 
              onChange={(e) => setTimezone(e.target.value)}
              style={inputStyle}
            >
              {moment.tz.names().map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </label>
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Strengths:
          </label>
          {strengthsOptions.map((option) => (
            <div key={option} style={{ marginBottom: '5px' }}>
              <input
                type="checkbox"
                value={option}
                checked={strengths.includes(option)}
                onChange={(e) => handleCheckboxChange(option, strengths, setStrengths)}
              />
              {option}
            </div>
          ))}
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Weaknesses:
          </label>
          {weaknessesOptions.map((option) => (
            <div key={option} style={{ marginBottom: '5px' }}>
              <input
                type="checkbox"
                value={option}
                checked={weaknesses.includes(option)}
                onChange={(e) => handleCheckboxChange(option, weaknesses, setWeaknesses)}
              />
              {option}
            </div>
          ))}
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Preferred Type of Cases:
          </label>
          {caseTypes.map((option) => (
            <div key={option} style={{ marginBottom: '5px' }}>
              <input
                type="checkbox"
                value={option}
                checked={preferredCaseTypes.includes(option)}
                onChange={(e) => handleCheckboxChange(option, preferredCaseTypes, setPreferredCaseTypes)}
              />
              {option}
            </div>
          ))}
        </div>
  
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Preferred Difficulty Level:
            <select 
              value={preferredDifficulty} 
              onChange={(e) => setPreferredDifficulty(e.target.value)}
              style={inputStyle}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </label>
        </div>
  
        <button style={buttonStyle} type="submit">Save Profile</button>
      </form>
  
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/dataviewer" style={{ color: 'darkblue' }}>View Database</Link>
      </div>
    </div>
  );
              }
  

export default UserProfile;
