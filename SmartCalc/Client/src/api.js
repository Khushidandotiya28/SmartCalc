const API_URL = "http://localhost:5000/api/history"; // Backend base URL

export const saveCalculation = async (calculation) => {
  const response = await fetch(API_URL, { // No extra `/history`
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(calculation),
  });

  if (!response.ok) {
    throw new Error("Failed to save calculation");
  }
  return response.json();
};

export const fetchHistory = async () => {
  const response = await fetch(API_URL); // No extra `/history`
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  return await response.json();
};

export const clearHistory = async () => {
  const response = await fetch(API_URL, { // No extra `/history`
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to clear history");
  }
};

export const deleteCalculation = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete calculation with id: ${id}`);
  }

  return response.json(); // Optional: return the deleted item for confirmation
};

