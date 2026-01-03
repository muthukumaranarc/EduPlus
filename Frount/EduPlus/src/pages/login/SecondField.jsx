import './SecondField.css'
import { useEffect, useState } from 'react';

function SecondField({
  dob,
  setDob,
  gender,
  setGender,
  mobile,
  setMobile,
  email,
  setEmail,
  linkedIn,
  setLinkedIn
}) {

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  const handleMobileChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length <= 10) {
      setMobile(value);
    }
  };

  useEffect(() => {
        const handleResize = () => {
            setDeviceWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

  return (
    <>
      <div className="row">

        <div className="field dob">
          <label>Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="field gender">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {
          !(deviceWidth < 768) && (
            <div className="field mobile">
              <label>Mobile number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={mobile}
                onChange={handleMobileChange}
              />
            </div>)
        }
      </div>
      {
        (deviceWidth < 768) && (
          <div className="field mobile">
            <label>Mobile number</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={mobile}
              onChange={handleMobileChange}
            />
          </div>)
      }

      <div className="row second">
        <div className="field email">
          <label>Email address</label>
          <input
            
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field linkedin">
          <label>LinkedIn</label>
          <input
            type="text"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default SecondField;
