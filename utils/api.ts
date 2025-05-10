import axios from 'axios';

const BASE_URL = 'https://exercisedb.p.rapidapi.com/exercises';

const options = {
  headers: {
    'X-RapidAPI-Key': '84206bc988msh1658b1ffc41f11bp1f4b3fjsn4eea01ca39af', // ⚠️ Move to .env in production
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

// ✅ Fetch All Exercises
export const fetchAllExercises = async () => {
  const response = await axios.get(BASE_URL, options);
  return response.data;
};

// 🏋️‍♂️ Fetch Exercises by Body Part (e.g. chest, back)
export const fetchExercisesByBodyPart = async (bodyPart) => {
  const response = await axios.get(`${BASE_URL}/bodyPart/${bodyPart}`, options);
  return response.data;
};

// 📋 Get All Body Parts (categories)
export const fetchBodyPartList = async () => {
  const response = await axios.get(`${BASE_URL}/bodyPartList`, options);
  return response.data;
};

// 🧰 Get All Equipment Types
export const fetchEquipmentList = async () => {
  const response = await axios.get(`${BASE_URL}/equipmentList`, options);
  return response.data;
};

// 🎯 Get All Target Muscle Groups
export const fetchTargetList = async () => {
  const response = await axios.get(`${BASE_URL}/targetList`, options);
  return response.data;
};

// ⚙️ Fetch Exercises by Equipment (e.g. dumbbell, barbell)
export const fetchExercisesByEquipment = async (equipment) => {
  const response = await axios.get(`${BASE_URL}/equipment/${equipment}`, options);
  return response.data;
};

// 🎯 Fetch Exercises by Target Muscle (e.g. biceps, quads)
export const fetchExercisesByTarget = async (target) => {
  const response = await axios.get(`${BASE_URL}/target/${target}`, options);
  return response.data;
};

// 🔎 Fetch Exercise by Name (e.g. "push up")
export const fetchExercisesByName = async (name) => {
  const response = await axios.get(`${BASE_URL}/name/${name}`, options);
  return response.data;
};

// 🆔 Fetch Specific Exercise by ID
export const fetchExerciseById = async (id) => {
  const response = await axios.get(`${BASE_URL}/exercise/${id}`, options);
  return response.data;
};
