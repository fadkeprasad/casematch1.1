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

      set(userPreferencesRef, {
        Email: email,
        caseLog: caseLog,
        numberOfCases: numberOfCases,
        timezone: timezone,
        strengths: strengths,
        weaknesses: weaknesses,
        preferredCaseTypes: preferredCaseTypes,
        preferredDifficulty: preferredDifficulty
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

  const labelStyle = {
    fontWeight: 'bold',
    color: 'blue',
    marginRight: '10px', // Optional, adds some space between the label and the input
  };

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

  

  useEffect(() => {
    // Set the default timezone
    setTimezone(moment.tz.guess());
  }, []);

  const formFieldStyle = { marginBottom: '20px' };

  return (

    <div style={{ margin: '20px' }}>

      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Email:
            <input type="text" value={email} onChange={(e) => setemail(e.target.value)} maxLength={50} />
          </label>
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Case Log URL:
            <input type="url" value={caseLog} onChange={(e) => setCaseLog(e.target.value)} />
          </label>
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Number of Cases:
            <select value={numberOfCases} onChange={(e) => setNumberOfCases(e.target.value)}>
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
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {moment.tz.names().map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
          Strengths:
          </label>
          {strengthsOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={strengths.includes(option)}
                onChange={(e) => handleCheckboxChange(option, strengths, setStrengths)}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
          Weaknesses:
          </label>
          {weaknessesOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={weaknesses.includes(option)}
                onChange={(e) => handleCheckboxChange(option, weaknesses, setWeaknesses)}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
          Preferred Type of Cases:
          </label>
          {caseTypes.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                checked={preferredCaseTypes.includes(option)}
                onChange={(e) => handleCheckboxChange(option, preferredCaseTypes, setPreferredCaseTypes)}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={formFieldStyle}>
          <label style={labelStyle}>
            Preferred Difficulty Level:
            <select value={preferredDifficulty} onChange={(e) => setPreferredDifficulty(e.target.value)}>
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit">Save Profile</button>
      </form>

      <div style={{ margin: '20px' }}>
      {/* ... existing form and other elements */}
      
      <Link to="/dataviewer">View Database</Link> {/* Add this line */}
      </div>

    </div>
    
    

    
  );
};

export default UserProfile;
