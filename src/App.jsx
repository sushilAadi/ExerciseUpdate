import { useState, useEffect } from 'react'
import './App.css'
import {exercisesData} from './utils/index'

function App() {
  const [count, setCount] = useState(0)
  const [exercises, setExercises] = useState(() => {
    const storedExercises = localStorage.getItem('exercises');
    return storedExercises ? JSON.parse(storedExercises) : exercisesData; // Load from localStorage or use default
  });

  useEffect(() => {
    const storedExercises = localStorage.getItem('exercises');
    if (storedExercises) {
      setExercises(JSON.parse(storedExercises)); // Load exercises from localStorage on mount
    }
  }, []);

  const [selectedExercise, setSelectedExercise] = useState(null) // Track selected exercise
  const [formData, setFormData] = useState({
    bodyPart: '',
    equipment: '',
    gifUrl: '',
    id: '',
    name: '',
    target: '',
    secondaryMuscles: [],
    instructions: []
  });

  const [searchTerm, setSearchTerm] = useState(''); // Track search term

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter exercises by name
  );

  const updateExercise = (id, updatedDetails) => {
    const updatedExercises = exercises.map(exercise => 
      exercise.id === id ? { 
        ...exercise, 
        ...updatedDetails, 
        updatedAt: new Date().toISOString(), // Set the updatedAt timestamp
        updated: true // Mark as updated
      } : exercise
    );
    localStorage.setItem('exercises', JSON.stringify(updatedExercises)); // Store updated exercises in localStorage
    setExercises(updatedExercises); // Update state with the new exercises
  }

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      id: exercise.id,
      name: exercise.name,
      target: exercise.target,
      secondaryMuscles: exercise.secondaryMuscles,
      instructions: exercise.instructions
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'instructions' ? value.split('\n') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateExercise(formData.id, formData); // Call updateExercise with the current formData
    alert('Exercise updated successfully!'); // Alert on successful update
  };

  const [copiedExerciseId, setCopiedExerciseId] = useState(null); // State to track the copied exercise ID

  return (
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-4">Update Exercises</h1>
      <div className='flex'>
        

        <ul className="">
        <input 
          type="text" 
          placeholder="Search Exercises" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
          {filteredExercises.map(exercise => ( // Use filtered exercises for display
            <li 
              key={exercise.id} 
              className={`cursor-pointer px-3 list-none text- py-1 ${selectedExercise?.id === exercise.id ? 'bg-yellow-200 rounded-md ' : ''}`} // Highlight selected exercise
              onClick={() => handleSelectExercise(exercise)}
            >
              {exercise.updated && <i className="fa-solid fa-check mr-2 text-green-500"/>} 
              {exercise.name}
              <i 
                className="fa-regular fa-copy ml-2 cursor-pointer" 
                onClick={() => {
                  navigator.clipboard.writeText(exercise.name); // Copy exercise name to clipboard
                  setCopiedExerciseId(exercise.id); // Set the copied exercise ID
                  setTimeout(() => {
                    setCopiedExerciseId(null); // Clear copied exercise ID after 5 seconds
                  }, 5000);
                }} 
                title="Copy Exercise Name"
              />
              {copiedExerciseId === exercise.id && <span className="text-sm font-bold  ml-2">Copied!</span>} {/* Show copied text message for the specific exercise */}
              {exercise.updatedAt && <span className="text-sm bg-green-200 rounded-md ml-2"> (Last updated: {new Date(exercise.updatedAt).toLocaleString()})</span>} {/* Show last update time */}
            </li>
          ))}
        </ul>

        <div className="ml-5 flex-1">
          {formData.id && (
            <form onSubmit={handleSubmit}>
              <label className="block mb-1 text-left">Exercise Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Exercise Name" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                disabled
              />
              
              <label className="block mb-1 text-left">Instructions</label>
              <textarea 
                name="instructions" 
                value={formData.instructions.join('\n')} 
                onChange={handleChange} 
                placeholder="Instructions" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full h-24"
                disabled
              />
              
              <label className="block mb-1 text-left">Body Part</label>
              <input 
                type="text" 
                name="bodyPart" 
                value={formData.bodyPart} 
                onChange={handleChange} 
                placeholder="Body Part" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                disabled
              />
              
              <label className="block mb-1 text-left">Equipment</label>
              <input 
                type="text" 
                name="equipment" 
                value={formData.equipment} 
                onChange={handleChange} 
                placeholder="Equipment" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                disabled
              />
              
              <label className="block mb-1 text-left">GIF URL</label>
              <input 
                type="text" 
                name="gifUrl" 
                value={formData.gifUrl} 
                onChange={handleChange} 
                placeholder="GIF URL" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
              />
              
              <label className="block mb-1 text-left">Target</label>
              <input 
                type="text" 
                name="target" 
                value={formData.target} 
                onChange={handleChange} 
                placeholder="Target" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                disabled
              />
              
              <label className="block mb-1 text-left">Secondary Muscles (comma separated)</label>
              <input 
                type="text" 
                name="secondaryMuscles" 
                value={formData.secondaryMuscles.join(', ')} 
                onChange={handleChange} 
                placeholder="Secondary Muscles" 
                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                disabled
              />
              
              <button 
                type="submit" 
                className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-200"
              >
                Update Exercise
              </button>
            </form>
          )}
        </div>

        {formData.id && (
          <div className="ml-5 flex-1 text-left">
            <h2 className="text-xl font-bold">Updated Exercise Details</h2>
            {formData.gifUrl && formData.gifUrl.includes('youtube.com') ? (
              <iframe 
                width="100%" 
                height="auto" 
                src={`https://www.youtube.com/embed/${formData.gifUrl.split('v=')[1]}`} 
                title={formData.name} 
                className="mb-4" 
                allowFullScreen
              />
            ) : (
              <img src={formData.gifUrl} alt={formData.name} className="w-full h-auto mb-4" />
            )}
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Body Part:</strong> {formData.bodyPart}</p>
            <p><strong>Equipment:</strong> {formData.equipment}</p>
            <p><strong>Target:</strong> {formData.target}</p>
            <p><strong>Secondary Muscles:</strong> {formData.secondaryMuscles.join(', ')}</p>
            <p><strong>Instructions:</strong></p>
            <ul>
              {formData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
