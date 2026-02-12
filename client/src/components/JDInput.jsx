const JDInput = ({ jd, setJD }) => (
  <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
    <label className="block text-white font-semibold text-lg mb-4">
      Job Description
    </label>
    <textarea
      rows="15"
      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-w-1"
      placeholder="Paste job description here..."
      onChange={(e) => setJD(e.target.value)}
      value={jd}
    />
  </div>
);
 
export default JDInput;
