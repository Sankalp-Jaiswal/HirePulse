const JDInput = ({ setJD }) => (
  <div className="bg-white p-4 rounded shadow">
    <label className="block font-medium mb-2">
      Job Description
    </label>
    <textarea
      rows="6"
      className="w-full border rounded p-2 focus:outline-none focus:ring"
      placeholder="Paste job description here..."
      onChange={(e) => setJD(e.target.value)}
    />
  </div>
);

export default JDInput;
