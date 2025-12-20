import './SecondField.css'

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
  return (
    <>
      {/* Row 1 */}
      <div className="row">
        {/* Date of birth */}
        <div className="field dob">
          <label>Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {/* Gender */}
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

        {/* Mobile number */}
        <div className="field mobile">
          <label>Mobile number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        {/* Email */}
        <div className="field email">
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* LinkedIn */}
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
