import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Slot = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios
      .get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/9')
      .then(response => {
        setDistricts(response.data.districts);
        setSelectedDistrict(response.data.districts[0].district_id);
      })
      .catch(error => {
        console.error('Error fetching districts:', error);
      });
  }, []);

  const handleDistrictChange = event => {
    setSelectedDistrict(event.target.value);
  };

  const handleSearch = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = `${tomorrow.getDate()}-${tomorrow.getMonth() + 1}-${tomorrow.getFullYear()}`;

    axios
      .get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${selectedDistrict}&date=${formattedDate}`)
      .then(response => {
        setSlots(response.data.sessions);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  };

  return (
    <div>

      <div className='opt'>
        <select placeholder='Select District' id="district" value={selectedDistrict} onChange={handleDistrictChange}>
          {districts.map(district => (
            <option key={district.district_id} value={district.district_id}>
              {district.district_name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch}>Search</button>
      <div className='result'>
        {slots.length === 0 ? (
          <p>No slots available.</p>
        ) : (
          <table className='data'>
            <tr>
              <th>Center Name</th>
              <th>Address</th>
              <th>Pincode</th>
            </tr>
            {slots.map(slot => (
              <tr key={slot.session_id}>
                <td>{slot.name}</td>
                <td>{slot.address}</td>
                <td>{slot.pincode}</td>
              </tr>
            ))}
          </table>
        )}
      </div>
    </div>
  );
};

export default Slot;
